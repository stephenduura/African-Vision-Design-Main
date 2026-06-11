import { useEffect } from "react";
import type { ReactNode } from "react";
import { useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowRight, Building2, Lock, Mail, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const memberTypes = ["individual", "organization", "volunteer"] as const;

const signInSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const signUpSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  memberType: z.enum(memberTypes),
}).superRefine((values, ctx) => {
  if (values.password !== values.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["confirmPassword"],
      message: "Passwords do not match",
    });
  }
});

function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center border border-primary/30 bg-primary/5">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <h1 className="font-serif text-3xl text-foreground">{title}</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
        </div>
        {children}
        <div className="mt-6 border-t border-border pt-5 text-center text-xs text-muted-foreground">
          {footer}
        </div>
      </div>
    </div>
  );
}

export function LocalSignInCard() {
  const { user, isLoaded, signIn } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (isLoaded && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [isLoaded, user, navigate]);

  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    const result = await signIn(values);
    if (!result.success) {
      toast({ title: "Sign in failed", description: result.error ?? "Please try again.", variant: "destructive" });
      return;
    }
    toast({ title: "Welcome back", description: "You are now signed in." });
    navigate("/dashboard", { replace: true });
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your Papi Foundation account and continue where you left off."
      footer={(
        <>
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="font-semibold text-primary hover:underline">
            Create one
          </Link>
        </>
      )}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[11px] tracking-widest uppercase font-semibold">Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input {...field} type="email" placeholder="you@example.com" className="pl-10 border-border focus:border-primary" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[11px] tracking-widest uppercase font-semibold">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input {...field} type="password" placeholder="Enter your password" className="pl-10 border-border focus:border-primary" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full bg-primary text-primary-foreground py-4 text-xs tracking-widest uppercase font-bold hover:bg-primary/90 transition-colors">
            Sign In <ArrowRight size={13} />
          </Button>
        </form>
      </Form>
    </AuthShell>
  );
}

export function LocalSignUpCard() {
  const { user, isLoaded, signUp } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      memberType: "individual",
    },
  });

  useEffect(() => {
    if (isLoaded && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [isLoaded, user, navigate]);

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    const result = await signUp({
      name: values.name,
      email: values.email,
      password: values.password,
      memberType: values.memberType,
    });
    if (!result.success) {
      toast({ title: "Account creation failed", description: result.error ?? "Please try again.", variant: "destructive" });
      return;
    }
    toast({ title: "Account created", description: "Your account has been created successfully." });
    navigate("/dashboard", { replace: true });
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join the Papi Foundation community and start your membership."
      footer={(
        <>
          Already have an account?{" "}
          <Link href="/sign-in" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </>
      )}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[11px] tracking-widest uppercase font-semibold">Full name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input {...field} placeholder="Your full name" className="pl-10 border-border focus:border-primary" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[11px] tracking-widest uppercase font-semibold">Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input {...field} type="email" placeholder="you@example.com" className="pl-10 border-border focus:border-primary" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="memberType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[11px] tracking-widest uppercase font-semibold">Membership type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="border-border focus:border-primary">
                      <SelectValue placeholder="Select your membership type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {memberTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[11px] tracking-widest uppercase font-semibold">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input {...field} type="password" placeholder="Create a password" className="pl-10 border-border focus:border-primary" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[11px] tracking-widest uppercase font-semibold">Confirm password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input {...field} type="password" placeholder="Confirm your password" className="pl-10 border-border focus:border-primary" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full bg-primary text-primary-foreground py-4 text-xs tracking-widest uppercase font-bold hover:bg-primary/90 transition-colors">
            Create Account <ArrowRight size={13} />
          </Button>
        </form>
      </Form>
    </AuthShell>
  );
}
