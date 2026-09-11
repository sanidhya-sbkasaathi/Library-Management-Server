import { createServerClient } from "@supabase/ssr";

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

export const updateSession = async (request: any, response: any) => {
  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies?.getAll ? request.cookies.getAll() : [];
        },
        setAll(cookiesToSet: any[]) {
          cookiesToSet.forEach(({ name, value, options }: any) => {
            request.cookies?.set?.(name, value);
            response.cookies?.set?.(name, value, options);
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user, response };
};
