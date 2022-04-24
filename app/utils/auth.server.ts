import { createCookieSessionStorage } from '@remix-run/node';
import { Authenticator, AuthorizationError } from 'remix-auth';
import { SupabaseStrategy } from 'remix-auth-supabase';

import { supabaseAdmin } from '~/utils/supabase.server';
import type { Session } from '~/utils/supabase.server';
import { prisma } from './db.server';

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: 'sb',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: [`${process.env.SUPABASE_SECRET}`],
    secure: process.env.NODE_ENV === 'production',
  },
});

export const supabaseStrategy = new SupabaseStrategy(
  {
    supabaseClient: supabaseAdmin,
    sessionStorage,
    sessionKey: 'sb:session',
    sessionErrorKey: 'sb:error',
  },
  async ({ req, supabaseClient }) => {
    const form = await req.formData();
    const email = form?.get('email');
    const password = form?.get('password');

    if (!email) throw new AuthorizationError('Email is required');
    if (typeof email !== 'string') throw new AuthorizationError('Email must be a string');

    if (!password) throw new AuthorizationError('Password is required');
    if (typeof password !== 'string') throw new AuthorizationError('Password must be a string');

    return supabaseClient.auth.api.signInWithEmail(email, password).then(
      ({ data, error }): Session => {
        if (error || !data) {
          throw new AuthorizationError(error?.message ?? 'No user session found');
        }

        return data;
      }
    );
  }
);

export const oAuthStrategy = new SupabaseStrategy(
  {
    supabaseClient: supabaseAdmin,
    sessionStorage,
    sessionKey: 'sb:session',
    sessionErrorKey: 'sb:error',
  },
  async ({ req }) => {
    const form = await req.formData();
    const session = form?.get('session');

    if (typeof session !== 'string') throw new AuthorizationError('session not found');
    const session_parsed = JSON.parse(session);

    await prisma.user.createMany({
      data: [
        {
          name: session_parsed.user.user_metadata.preferred_username,
          email: session_parsed.user.user_metadata.email,
          picture: session_parsed.user.user_metadata.avatar_url,
        },
      ],
      skipDuplicates: true,
    });
    return session_parsed;
  }
);

export const authenticator = new Authenticator<Session>(sessionStorage, {
  sessionKey: supabaseStrategy.sessionKey,
  sessionErrorKey: supabaseStrategy.sessionErrorKey,
});

authenticator.use(supabaseStrategy);
authenticator.use(oAuthStrategy, 'sb-oauth');
