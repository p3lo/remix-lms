import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';

import { authenticator, sessionStorage, supabaseStrategy } from '~/utils/auth.server';
import { signInWithGithub, signInWithGoogle } from '~/utils/supabase.client';
import { AiFillGithub, AiFillGoogleCircle, AiOutlineLogin } from 'react-icons/ai';
import { RiAtLine, RiLockPasswordLine } from 'react-icons/ri';
import { Button, TextInput } from '@mantine/core';

type LoaderData = {
  error: { message: string } | null;
};

export const action: ActionFunction = async ({ request }) => {
  await authenticator.authenticate('sb', request, {
    successRedirect: '/',
    failureRedirect: '/login',
  });
};

export const loader: LoaderFunction = async ({ request }) => {
  await supabaseStrategy.checkSession(request, {
    successRedirect: '/',
  });

  const session = await sessionStorage.getSession(request.headers.get('Cookie'));

  const error = session.get(authenticator.sessionErrorKey) as LoaderData['error'];

  return json<LoaderData>({ error });
};

export default function Screen() {
  const { error } = useLoaderData<LoaderData>();

  return (
    <>
      <Form method="post" className="flex flex-col space-y-3 pb-5">
        {error && <p className="text-red-500 text-xs mx-auto">{error.message}</p>}
        <TextInput
          placeholder="Your e-mail"
          label="E-mail"
          type="email"
          name="email"
          id="email"
          required
          icon={<RiAtLine size={14} />}
        />
        <TextInput
          placeholder="Your password"
          label="Password"
          type="password"
          name="password"
          id="password"
          required
          icon={<RiLockPasswordLine size={14} />}
        />

        <Button leftIcon={<AiOutlineLogin size={17} />} variant="outline" className="w-1/2 mx-auto" type="submit">
          Login
        </Button>
      </Form>
      <div className="flex flex-col space-y-2 justify-center">
        <Button
          leftIcon={<AiFillGithub size={17} />}
          variant="outline"
          onClick={() => signInWithGithub()}
          className="w-1/2 mx-auto"
        >
          Sign in with Github
        </Button>
        <Button
          leftIcon={<AiFillGoogleCircle size={17} />}
          variant="outline"
          onClick={() => signInWithGoogle()}
          className="w-1/2 mx-auto"
        >
          Sign in with Google
        </Button>
      </div>
    </>
  );
}
