import { Button } from '@mantine/core';
import type { ActionFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { Form } from '@remix-run/react';
import { AiOutlineLogin } from 'react-icons/ai';

export const action: ActionFunction = async ({ request }) => {
  return redirect('/login');
};

function ConfirmEmail() {
  return (
    <div className="flex flex-col space-y-5 justify-center pt-[20vh]">
      <p className="text-md text-center">Your registration has been completed. Please confirm email for login.</p>
      <Form method="post" className="mx-auto">
        <Button leftIcon={<AiOutlineLogin size={17} />} variant="outline" className="w-[200px] " type="submit">
          To login page
        </Button>
      </Form>
    </div>
  );
}

export default ConfirmEmail;
