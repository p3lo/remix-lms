import { Button, TextInput } from '@mantine/core';
import type { ActionFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { Form } from '@remix-run/react';
import { RiAtLine, RiLockPasswordLine, RiPencilLine, RiText } from 'react-icons/ri';
import { sessionStorage } from '~/utils/auth.server';
import { supabaseAdmin } from '~/utils/supabase.server';

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const email = form.get('email')!;
  const name = form.get('name')!;
  const password = form.get('password')!;

  if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
    throw new Error(`Form not submitted correctly.`);
  }

  // remember to do the "Email Confirmation" toggle of "supabaseSession" will be null
  const { error, session: supabaseSession } = await supabaseAdmin.auth.signUp(
    {
      email,
      password,
    },
    {
      data: { name },
    }
  );

  if (error) {
    return { error: true, ...error };
  }

  const session = await sessionStorage.getSession(request.headers.get('Cookie'));
  session.set('sb:session', {
    access_token: supabaseSession!.access_token,
    refresh_token: supabaseSession!.refresh_token,
  });

  return redirect('/', {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session), // in my case every new signup lead to "/"
    },
  });
};

function Register() {
  return (
    <Form method="post" className="flex flex-col space-y-3 pb-5">
      <TextInput
        placeholder="Your full name"
        label="Full name"
        type="text"
        name="name"
        id="name"
        required
        icon={<RiText size={14} />}
      />
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

      <Button leftIcon={<RiPencilLine size={17} />} variant="outline" className="w-1/2 mx-auto" type="submit">
        Register
      </Button>
    </Form>
  );
}

export default Register;
