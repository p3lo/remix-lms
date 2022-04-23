import { Button, TextInput } from '@mantine/core';
import type { ActionFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { RiAtLine, RiLockPasswordLine, RiPencilLine, RiText } from 'react-icons/ri';
import { supabaseAdmin } from '~/utils/supabase.server';

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const email = form.get('email')!;
  const name = form.get('name')!;
  const password = form.get('password')!;

  if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
    throw new Error(`Form not submitted correctly.`);
  }

  const { error } = await supabaseAdmin.auth.signUp(
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

  return redirect('/confirm-email');
};

function Register() {
  const error = useActionData() as Error;
  return (
    <>
      {error && <p className="text-red-500 text-xs mx-auto">{error.message}</p>}
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
    </>
  );
}

export default Register;
