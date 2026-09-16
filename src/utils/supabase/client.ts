import { createBrowserClient } from "@supabase/ssr";

export const getSupabaseConfig = () => {
  const url =
    (typeof localStorage !== 'undefined' && localStorage.getItem('mgmt_server_supabase_url')) ||
    (typeof window !== 'undefined' && (window as any).__ENV?.VITE_SUPABASE_URL) ||
    (import.meta as any).env?.VITE_SUPABASE_URL ||
    (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_URL ||
    "";

  const key =
    (typeof localStorage !== 'undefined' && localStorage.getItem('mgmt_server_supabase_anon_key')) ||
    (typeof window !== 'undefined' && (window as any).__ENV?.VITE_SUPABASE_ANON_KEY) ||
    (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ||
    (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY ||
    (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    "";

  return { url, key };
};

export const createClient = () => {
  const { url, key } = getSupabaseConfig();
  if (!url || !key) {
    // Return mock-safe client or client with dummy URL if not yet configured
    return createBrowserClient(
      url || "https://placeholder-project.supabase.co",
      key || "placeholder-anon-key"
    );
  }
  return createBrowserClient(url, key);
};
