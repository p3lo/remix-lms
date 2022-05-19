import type { LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import { supabaseStrategy } from '~/utils/auth.server';

export const loader: LoaderFunction = async ({ request }) => {
  const session = await supabaseStrategy.checkSession(request);
  if (!session) {
    return redirect('/');
  }
  return null;
};

function Learn() {
  return (
    <>
      <Outlet />
    </>
  );
}

export default Learn;
