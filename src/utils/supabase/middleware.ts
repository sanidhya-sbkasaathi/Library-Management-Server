import { createServerClient } from "@supabase/ssr";
import { getSupabaseConfig } from "./client";

export const updateSession = async (request: any) => {
  const { url, key } = getSupabaseConfig();
  const supabase = createServerClient(
    url || "https://placeholder-project.supabase.co",
    key || "placeholder-anon-key",
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: any[]) {
          cookiesToSet.forEach(({ name, value }: any) =>
            request.cookies.set(name, value)
          );
        },
      },
    }
  );

  const user = await supabase.auth.getUser();
  return { supabase, user };
};
