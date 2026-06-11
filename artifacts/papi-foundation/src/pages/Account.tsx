import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";

export default function Account() {
  const { user, isLoaded } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isLoaded) return;
    navigate(user ? "/dashboard" : "/sign-in", { replace: true });
  }, [isLoaded, user, navigate]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground text-sm">
      Loading...
    </div>
  );
}
