import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePubKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const test = () => {
  console.log("URL:", supabaseUrl);
  console.log("Key:", supabasePubKey);
};

export const supabase = createClient(supabaseUrl, supabasePubKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
