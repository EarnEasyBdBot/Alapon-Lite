// supabase.js — Supabase Client Setup & Config
export const SUPABASE_URL = "https://zupcozqzlrbnkrayczhu.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cGNvenF6bHJibmtyYXljemh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczMTk1NjEsImV4cCI6MjEwMjg5NTU2MX0.DEXBozpPby1avPDJshsILP9_-PM6HS_-HpVj5KsyfRg";

export const isConfigured = () =>
  SUPABASE_URL !== "https://zupcozqzlrbnkrayczhu.supabase.co" &&
  SUPABASE_ANON_KEY !== "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cGNvenF6bHJibmtyYXljemh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczMTk1NjEsImV4cCI6MjEwMjg5NTU2MX0.DEXBozpPby1avPDJshsILP9_-PM6HS_-HpVj5KsyfRg" &&
  Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase = isConfigured()
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;

// Storage Upload Helper
export async function uploadFile(bucket, path, file) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: true
  });
  if (error) throw error;
  const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(path);
  return publicUrlData.publicUrl;
}