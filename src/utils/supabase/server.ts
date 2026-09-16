import { createServerClient } from "@supabase/ssr";
import { getSupabaseConfig } from "./client";

export const createClient = (cookieStore?: any) => {
  const { url, key } = getSupabaseConfig();
  return createServerClient(
    url || "https://placeholder-project.supabase.co",
    key || "placeholder-anon-key",
    {
      cookies: {
        getAll() {
          return cookieStore ? cookieStore.getAll() : [];
        },
        setAll(cookiesToSet: any[]) {
          try {
            if (cookieStore) {
              cookiesToSet.forEach(({ name, value, options }: any) =>
                cookieStore.set(name, value, options)
              );
            }
          } catch {
            // Server Component ignore
          }
        },
      },
    }
  );
};
