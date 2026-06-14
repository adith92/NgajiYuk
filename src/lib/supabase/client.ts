import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // We use non-null assertion as Next.js will warn if they are missing at build time
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
