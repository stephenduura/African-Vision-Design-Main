import type { Request, Response, NextFunction } from "express";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (process.env.SUPABASE_URL || "https://kzfibfvfejutygenjfhs.supabase.co").trim();
const supabaseAnonKey = (process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6ZmliZnZmZWp1dHlnZW5qZmhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2NzQ1OTMsImV4cCI6MjA5NjI1MDU5M30.2HL8GqFV-DD4q0h0I6KlnUsdNCugrmBBxii5iuRiRRY").trim();

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    memberType: "individual" | "organization" | "volunteer";
    imageUrl: string | null;
  } | null;
}

export async function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    req.user = null;
    return next();
  }

  const token = authorization.slice("Bearer ".length).trim();

  // Support local preview tokens during development
  if (process.env.NODE_ENV !== "production" && token.startsWith("local:")) {
    try {
      const raw = decodeURIComponent(token.slice("local:".length));
      const parsed = JSON.parse(raw);
      if (parsed.id) {
        req.user = {
          id: parsed.id,
          name: parsed.name?.trim() || "Member",
          email: parsed.email || "",
          memberType: parsed.memberType || "individual",
          imageUrl: parsed.imageUrl || null,
        };
        return next();
      }
    } catch {
      // Fall through to standard verification
    }
  }

  // Verify Supabase Auth JWT
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      req.user = null;
      return next();
    }

    req.user = {
      id: user.id,
      name: user.user_metadata?.name || user.email?.split("@")[0] || "Member",
      email: user.email || "",
      memberType: user.user_metadata?.memberType || "individual",
      imageUrl: user.user_metadata?.avatarUrl || null,
    };
    next();
  } catch (err) {
    req.user = null;
    next();
  }
}
