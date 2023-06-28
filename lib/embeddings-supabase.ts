import { createClient } from "@supabase/supabase-js";

interface Client {
  url?: string;
  key?: string;
}

const client: Client = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  key: process.env.SUPABASE_ANON_KEY
};

// const SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1eXd0eWd6bG1hYWd0ZG9qbnlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODY3MDk5NjcsImV4cCI6MjAwMjI4NTk2N30.oM6EIhnrq33zdO5wjxU4YRumPyakuvi180sMpBimlXc";
// const NEXT_PUBLIC_SUPABASE_URL="https://tuywtygzlmaagtdojnyg.supabase.co";
// const client: Client = {
//   url: NEXT_PUBLIC_SUPABASE_URL,
//   key: SUPABASE_ANON_KEY
// };

if (!client.url || !client.key) {
  throw new Error("Missing Supabase credentials");
}

export const supabaseClient = createClient(client.url!, client.key!);
