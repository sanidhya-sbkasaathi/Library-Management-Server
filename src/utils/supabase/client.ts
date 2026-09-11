import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl =
  (typeof window !== 'undefined' && (window as any).__ENV?.NEXT_PUBLIC_SUPABASE_URL) ||
  (import.meta as any).env?.VITE_SUPABASE_URL ||
  (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_URL ||
  "https://jsvevzzupajrgzxsmmyr.supabase.co";

const supabaseKey =
  (typeof window !== 'undefined' && (window as any).__ENV?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ||
  (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY ||
  (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_xh7iUtUdJYdu4xjzPIVyWg_Wr1_76NR";

export const createClient = () =>
  createBrowserClient(
    supabaseUrl,
    supabaseKey
  );
