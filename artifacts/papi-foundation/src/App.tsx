import { useEffect, useRef } from "react";
import {
  Switch,
  Route,
  Router as WouterRouter,
  Redirect,
  useLocation,
} from "wouter";
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
import { ClerkProvider, SignIn, SignUp, useClerk } from "@clerk/react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { shadcn } from "@clerk/themes";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { LocalSignInCard, LocalSignUpCard } from "@/components/auth/LocalAuthForms";
import NotFound from "@/pages/not-found";

import Layout from "@/components/layout/Layout";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Projects from "@/pages/Projects";
import ProjectDetail from "@/pages/ProjectDetail";
import Team from "@/pages/Team";
import Impact from "@/pages/Impact";
import Donate from "@/pages/Donate";
import Community from "@/pages/Community";
import Partners from "@/pages/Partners";
import Blog from "@/pages/Blog";
import BlogPostDetail from "@/pages/BlogPostDetail";
import Roadmap from "@/pages/Roadmap";
import Contact from "@/pages/Contact";
import Office from "@/pages/Office";
import DoingBusiness from "@/pages/DoingBusiness";
import AfricanInsights from "@/pages/AfricanInsights";
import Vacancies from "@/pages/Vacancies";
import Account from "@/pages/Account";
import News from "@/pages/News";
import EventDetail from "@/pages/EventDetail";
import Dashboard from "@/pages/Dashboard";

const queryClient = new QueryClient();

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);

const isLocalPreviewHost = ["localhost", "127.0.0.1", "::1"].includes(
  window.location.hostname,
);
const clerkEnabled = Boolean(clerkPubKey) && (!isLocalPreviewHost || import.meta.env.VITE_FORCE_CLERK === "true");

const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
    socialButtonsPlacement: "top" as const,
    socialButtonsVariant: "blockButton" as const,
  },
  variables: {
    colorPrimary: "hsl(43, 72%, 42%)",
    colorForeground: "hsl(30, 25%, 12%)",
    colorMutedForeground: "hsl(30, 15%, 45%)",
    colorDanger: "hsl(0, 84%, 55%)",
    colorBackground: "hsl(42, 30%, 98%)",
    colorInput: "hsl(42, 38%, 96%)",
    colorInputForeground: "hsl(30, 25%, 12%)",
    colorNeutral: "hsl(40, 18%, 85%)",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    borderRadius: "0.375rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox:
      "bg-[hsl(42,30%,98%)] rounded-2xl w-[440px] max-w-full overflow-hidden border border-[hsl(43,60%,45%)]/20 shadow-xl",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "text-[hsl(30,25%,12%)] font-serif text-2xl",
    headerSubtitle: "text-[hsl(30,15%,45%)]",
    socialButtonsBlockButtonText: "text-[hsl(30,25%,12%)] font-semibold",
    formFieldLabel:
      "text-[hsl(30,25%,12%)] font-semibold text-[11px] tracking-widest uppercase",
    footerActionLink: "text-[hsl(43,72%,38%)] font-semibold hover:underline",
    footerActionText: "text-[hsl(30,15%,45%)]",
    dividerText: "text-[hsl(30,15%,45%)]",
    identityPreviewEditButton: "text-[hsl(43,72%,38%)]",
    formFieldSuccessText: "text-[hsl(158,42%,28%)]",
    alertText: "text-[hsl(30,25%,12%)]",
    logoBox: "h-14 w-full flex justify-center overflow-visible",
    logoImage: "h-14 w-auto max-w-full object-contain",
    socialButtonsBlockButton:
      "border border-[hsl(40,18%,85%)] hover:bg-[hsl(40,20%,91%)]",
    formButtonPrimary:
      "bg-[hsl(43,72%,42%)] hover:bg-[hsl(43,72%,38%)] text-[hsl(42,38%,97%)] uppercase tracking-widest text-xs font-bold",
    formFieldInput:
      "bg-[hsl(42,38%,96%)] border border-[hsl(40,18%,85%)] text-[hsl(30,25%,12%)]",
    dividerLine: "bg-[hsl(40,18%,85%)]",
    alert: "border border-[hsl(40,18%,85%)]",
    otpCodeFieldInput: "text-[hsl(30,25%,12%)] border-[hsl(40,18%,85%)]",
  },
};

function SignInPage() {
  if (!clerkEnabled) {
    return <LocalSignInCard />;
  }

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-12">
      <SignIn
        routing="path"
        path={`${basePath}/sign-in`}
        signUpUrl={`${basePath}/sign-up`}
      />
    </div>
  );
}

function SignUpPage() {
  if (!clerkEnabled) {
    return <LocalSignUpCard />;
  }

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-12">
      <SignUp
        routing="path"
        path={`${basePath}/sign-up`}
        signInUrl={`${basePath}/sign-in`}
      />
    </div>
  );
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (
        prevUserIdRef.current !== undefined &&
        prevUserIdRef.current !== userId
      ) {
        qc.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, qc]);

  return null;
}

function SiteRoutes() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/projects" component={Projects} />
        <Route path="/projects/:id" component={ProjectDetail} />
        <Route path="/team" component={Team} />
        <Route path="/impact" component={Impact} />
        <Route path="/donate" component={Donate} />
        <Route path="/community" component={Community} />
        <Route path="/partners" component={Partners} />
        <Route path="/events"><Redirect to="/news" /></Route>
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:id" component={BlogPostDetail} />
        <Route path="/roadmap" component={Roadmap} />
        <Route path="/contact" component={Contact} />
        <Route path="/office" component={Office} />
        <Route path="/doing-business" component={DoingBusiness} />
        <Route path="/african-insights" component={AfricanInsights} />
        <Route path="/vacancies" component={Vacancies} />
        <Route path="/account" component={Account} />
        <Route path="/news" component={News} />
        <Route path="/news/:id" component={EventDetail} />
        <Route path="/dashboard" component={Dashboard} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: {
          start: {
            title: "Welcome back",
            subtitle: "Sign in to join the Papi Foundation community",
          },
        },
        signUp: {
          start: {
            title: "Join the movement",
            subtitle: "Create your Papi Foundation account",
          },
        },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <TooltipProvider>
          <AuthProvider>
            <Switch>
              <Route path="/sign-in/*?" component={SignInPage} />
              <Route path="/sign-up/*?" component={SignUpPage} />
              <Route component={SiteRoutes} />
            </Switch>
            <Toaster />
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function LocalProviderWithRoutes() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider mode="local">
          <Switch>
            <Route path="/sign-in/*?" component={SignInPage} />
            <Route path="/sign-up/*?" component={SignUpPage} />
            <Route component={SiteRoutes} />
          </Switch>
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      {clerkEnabled ? <ClerkProviderWithRoutes /> : <LocalProviderWithRoutes />}
    </WouterRouter>
  );
}

export default App;
