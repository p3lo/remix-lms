import { ActionIcon, Button, Image, Paper, Text, Title } from '@mantine/core';

import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { Form, Link, useMatches } from '@remix-run/react';
import { RiDeleteBin6Line } from 'react-icons/ri';
import invariant from 'tiny-invariant';
import MainLayout from '~/components/layouts/main-layout/MainLayout';
import { supabaseStrategy } from '~/utils/auth.server';
import { prisma } from '~/utils/db.server';
import type { User } from '~/utils/types';

export const loader: LoaderFunction = async ({ request }) => {
  const session = await supabaseStrategy.checkSession(request);
  if (!session) {
    return {
      redirect: '/',
    };
  }
  return null;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const action = formData.get('action');
  if (action === 'delete') {
    const cartId = formData.get('cartId');
    invariant(cartId, 'cartId is required');
    await prisma.cart.delete({
      where: {
        id: +cartId,
      },
    });
  }
  return null;
};

function Cart() {
  const profile = useMatches()[0].data.profile as User;
  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto mt-10">
        <Title order={1}>Shopping Cart</Title>
        <div className="grid grid-cols-5 gap-10 mt-10">
          <div className="col-span-4">
            <Text size="md">{profile.cart.length} Course(s) in Cart</Text>
            {profile.cart.length > 0 ? (
              profile.cart.map((course) => (
                <div key={course.id} className="flex flex-col mt-3">
                  <Paper p="xs" withBorder className="flex items-start justify-between space-x-5">
                    <div className="flex items-start space-x-2">
                      <Image height={80} width={160} src={course.course.image}></Image>
                      <div className="flex flex-col">
                        <Text lineClamp={2} size="sm" weight={700}>
                          {course.course.title}
                        </Text>
                        <Text size="xs">By {profile.name}</Text>
                      </div>
                    </div>
                    <Form method="post" className="flex items-start space-x-1">
                      <Text size="md" weight={700}>
                        {course.course.price > 0 ? `$${course.course.price}` : 'Free'}
                      </Text>
                      <input hidden readOnly name="cartId" value={course.id} />
                      <ActionIcon component="button" name="action" value="delete" type="submit" color="red">
                        <RiDeleteBin6Line className="cursor-pointer" size={16} />
                      </ActionIcon>
                    </Form>
                  </Paper>
                </div>
              ))
            ) : (
              <Paper p="xl" withBorder className="py-[10vh]">
                <div className="flex flex-col items-center space-y-5">
                  <Text size="md" weight={500}>
                    There is nothing in the cart, keep browsing
                  </Text>
                  <Button component={Link} to="/">
                    Go to Courses
                  </Button>
                </div>
              </Paper>
            )}
          </div>
          {profile.cart.length > 0 && (
            <div className="flex flex-col space-y-1">
              <Text size="md">Total:</Text>
              <Text size="xl" weight={700}>
                ${profile.cart.reduce((acc, course) => acc + course.course.price, 0)}
              </Text>
              <Button>Checkout</Button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default Cart;
