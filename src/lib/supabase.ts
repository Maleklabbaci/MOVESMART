import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  import.meta.env?.VITE_SUPABASE_URL ||
  "https://uajdrtluahvafgoctzwf.supabase.co";
const SUPABASE_ANON_KEY =
  import.meta.env?.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhamRydGx1YWh2YWZnb2N0endmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1ODM5MTgsImV4cCI6MjA5MjE1OTkxOH0.bOmBnd_OppkgX4MqhLswdw-K9MGQ_wTgNu7qWVotQfY";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  db: { retry: false, timeout: 20_000 },
  global: {
    fetch: (input, init) =>
      fetch(input, {
        ...init,
        // Do not leave forms / the admin on an endless loading screen.
        signal: init?.signal
          ? AbortSignal.any([init.signal, AbortSignal.timeout(20_000)])
          : AbortSignal.timeout(20_000),
      }),
  },
});
