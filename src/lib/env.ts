export interface PublicEnvironment {
  supabaseUrl: string | null;
  supabaseAnonKey: string | null;
  isSupabaseConfigured: boolean;
}

function readPublicValue(value: string | undefined): string | null {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

export function getPublicEnvironment(): PublicEnvironment {
  const supabaseUrl = readPublicValue(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const supabaseAnonKey = readPublicValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  return {
    supabaseUrl,
    supabaseAnonKey,
    isSupabaseConfigured: Boolean(supabaseUrl && supabaseAnonKey),
  };
}

export function assertPublicEnvironment() {
  const environment = getPublicEnvironment();
  if (!environment.isSupabaseConfigured) {
    throw new Error(
      "Supabase belum dikonfigurasi. Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }
  return {
    supabaseUrl: environment.supabaseUrl as string,
    supabaseAnonKey: environment.supabaseAnonKey as string,
  };
}
