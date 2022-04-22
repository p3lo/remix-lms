import { createClient } from '@supabase/supabase-js';
import invariant from 'tiny-invariant';

declare global {
  interface Window {
    env: {
      SUPABASE_URL: string;
      PUBLIC_SUPABASE_ANON_KEY: string;
    };
  }
}

invariant(window.env.SUPABASE_URL, 'SUPABASE_URL is required');
invariant(window.env.PUBLIC_SUPABASE_ANON_KEY, 'PUBLIC_SUPABASE_ANON_KEY is required');

// Supabase options example (build your own :))
// https://supabase.com/docs/reference/javascript/initializing#with-additional-parameters

// const supabaseOptions = {
//   fetch, // see ⚠️ cloudflare
//   schema: "public",
//   persistSession: false,
//   autoRefreshToken: false,
//   detectSessionInUrl: true,
//   headers: { "x-application-name": "{my-site-name}" }
// };

// ⚠️ cloudflare needs you define fetch option : https://github.com/supabase/supabase-js#custom-fetch-implementation
// Use Remix fetch polyfill for node (See https://remix.run/docs/en/v1/other-api/node)
export const supabaseClient = createClient(window.env.SUPABASE_URL, window.env.PUBLIC_SUPABASE_ANON_KEY, {
  autoRefreshToken: false,
  persistSession: false,
});

export const signInWithGithub = (redirectTo = 'http://localhost:3000/oauth/callback') =>
  supabaseClient.auth.signIn(
    {
      provider: 'github',
    },
    { redirectTo }
  );

export const signInWithGoogle = (redirectTo = 'http://localhost:3000/oauth/callback') =>
  supabaseClient.auth.signIn(
    {
      provider: 'google',
    },
    { redirectTo }
  );
