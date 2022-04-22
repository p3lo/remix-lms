import { createClient } from '@supabase/supabase-js';
import type { Session } from '@supabase/supabase-js';
import invariant from 'tiny-invariant';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SUPABASE_URL: string;
      SUPABASE_SERVICE_KEY: string;
      PUBLIC_SUPABASE_ANON_KEY: string;
    }
  }
}

invariant(process.env.SUPABASE_URL, 'SUPABASE_URL is required');
invariant(process.env.SUPABASE_SERVICE_KEY, 'SUPABASE_SERVICE_KEY is required');

// Supabase options example (build your own :))
// https://supabase.com/docs/reference/javascript/initializing#with-additional-parameters

// const supabaseOptions = {
//   fetch, // see ⚠️ cloudflare
//   schema: "public",
//   persistSession: true,
//   autoRefreshToken: true,
//   detectSessionInUrl: true,
//   headers: { "x-application-name": "{my-site-name}" }
// };

// ⚠️ cloudflare needs you define fetch option : https://github.com/supabase/supabase-js#custom-fetch-implementation
// Use Remix fetch polyfill for node (See https://remix.run/docs/en/v1/other-api/node)
export const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

export { Session };
