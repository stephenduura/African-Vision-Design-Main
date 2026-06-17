import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { pinoHttp, type HttpLogger } from "pino-http";
import type { IncomingMessage, ServerResponse } from "http";
import { clerkMiddleware } from "@clerk/express";
import { publishableKeyFromHost } from "@clerk/shared/keys";
import {
  CLERK_PROXY_PATH,
  clerkProxyMiddleware,
  getClerkProxyHost,
} from "./middlewares/clerkProxyMiddleware";
import router from "./routes";
import { logger } from "./lib/logger";
import { WebhookHandlers } from "./webhookHandlers";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req: IncomingMessage) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res: ServerResponse) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

// Clerk proxy streams raw bytes and must be mounted before any body parser.
app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());

app.use(cors({ credentials: true, origin: true }));

// Stripe webhook MUST receive the raw body and therefore must be registered
// BEFORE express.json(). Do not move this below the JSON body parser.
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  async (req, res): Promise<void> => {
    const signature = req.headers["stripe-signature"];
    if (!signature) {
      res.status(400).json({ error: "Missing stripe-signature" });
      return;
    }
    const sig = Array.isArray(signature) ? signature[0]! : signature;
    try {
      await WebhookHandlers.processWebhook(req.body as Buffer, sig);
      res.status(200).json({ received: true });
    } catch (err) {
      req.log.error({ err }, "Stripe webhook processing failed");
      res.status(400).json({ error: "Webhook processing error" });
    }
  },
);

// Community image posts can carry data URLs, so the parser needs a higher
// limit than Express' tiny default payload size.
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Resolve the publishable key from the incoming request host so the same
// server can serve multiple Clerk custom domains. Falls back to
// CLERK_PUBLISHABLE_KEY when the host doesn't map to a custom domain.
const clerkSecretKey = process.env.CLERK_SECRET_KEY?.trim();
if (clerkSecretKey) {
  app.use(
    clerkMiddleware((req) => ({
      publishableKey: publishableKeyFromHost(
        getClerkProxyHost(req) ?? "",
        process.env.CLERK_PUBLISHABLE_KEY,
      ),
    })),
  );
}

// Apply security headers
app.use(helmet());

// Apply rate limiting to all standard API routes except webhooks (since Stripe sends webhooks in batch)
const isProduction = process.env.NODE_ENV === "production";
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 150, // limit each IP to 150 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests, please try again later." },
    skip: (req) => req.path.startsWith("/stripe/webhook"), // Do not rate limit stripe webhooks
  })
);

app.use("/api", router);

// Centralized global error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  req.log.error({ err }, "Unhandled application error");
  
  const statusCode = err.statusCode || err.status || 500;
  const isConfigError = err.message && (err.message.includes("must be set") || err.message.includes("Stripe") || err.message.includes("Clerk"));
  const message = isProduction && !isConfigError ? "Internal Server Error" : (err.message || "Internal Server Error");
  
  res.status(statusCode).json({
    error: message,
    ...(isProduction ? {} : { stack: err.stack }),
  });
});

export default app;
