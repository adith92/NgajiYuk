import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getPublicEnvironment } from "@/lib/env";

let browserClient: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return getPublicEnvironment().isSupabaseConfigured;
}

export function createClient(): SupabaseClient | null {
  if (browserClient) return browserClient;

  const environment = getPublicEnvironment();
  if (!environment.supabaseUrl || !environment.supabasePublishableKey) return null;

  browserClient = createBrowserClient(
    environment.supabaseUrl,
    environment.supabasePublishableKey,
  );
  return browserClient;
}
