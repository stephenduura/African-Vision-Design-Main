import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { pinoHttp } from "pino-http";
import type { IncomingMessage, ServerResponse } from "http";
import router from "./routes";
import { logger } from "./lib/logger";
import { WebhookHandlers } from "./webhookHandlers";
import { authMiddleware } from "./middlewares/authMiddleware";

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

// Mount Supabase authentication middleware
app.use(authMiddleware as any);

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
  const message = (err.message || "Internal Server Error") + "\nStack: " + String(err.stack);
  
  res.status(statusCode).json({
    error: message
  });
});

export default app;
