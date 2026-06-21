import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://kzfibfvfejutygenjfhs.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

if (!supabaseAnonKey) {
  console.warn("VITE_SUPABASE_ANON_KEY is not defined. Please add it to your environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
