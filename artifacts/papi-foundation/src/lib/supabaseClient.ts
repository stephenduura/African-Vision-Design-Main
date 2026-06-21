import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || "https://kzfibfvfejutygenjfhs.supabase.co").trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6ZmliZnZmZWp1dHlnZW5qZmhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2NzQ1OTMsImV4cCI6MjA5NjI1MDU5M30.2HL8GqFV-DD4q0h0I6KlnUsdNCugrmBBxii5iuRiRRY").trim();

if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn("VITE_SUPABASE_ANON_KEY is not defined. Using fallback key for UI rendering.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
