import {
  Switch,
  Route,
  Router as WouterRouter,
  Redirect,
} from "wouter";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
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
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function SignInPage() {
  return <LocalSignInCard />;
}

function SignUpPage() {
  return <LocalSignUpCard />;
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

function App() {
  return (
    <WouterRouter base={basePath}>
      <QueryClientProvider client={queryClient}>
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
    </WouterRouter>
  );
}

export default App;
