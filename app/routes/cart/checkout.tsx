import { Button, Modal, Text } from '@mantine/core';

import type { ActionFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { Form, useMatches, useNavigate } from '@remix-run/react';
import { useEffect, useState } from 'react';
import invariant from 'tiny-invariant';

import { prisma } from '~/utils/db.server';
import type { User } from '~/utils/types';

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const userId = formData.get('userId');
  invariant(userId, 'userId is required');
  const getCart = await prisma.cart.findMany({
    where: {
      userId: +userId,
    },
  });
  if (!getCart) {
    return null;
  }
  let data = [] as { courseId: number; userId: number }[];
  getCart.map((course) =>
    data.push({
      courseId: +course.courseId,
      userId: +course.userId,
    })
  );
  const addEnrollments = prisma.enrolled_course.createMany({ data });
  const deleteCart = prisma.cart.deleteMany({
    where: {
      userId: +userId,
    },
  });
  await prisma.$transaction([addEnrollments, deleteCart]);

  return redirect('/user/owned-courses');
};

function Checkout() {
  const [opened, setOpened] = useState(false);
  const profile = useMatches()[0].data.profile as User;
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      setOpened((prev) => !prev);
    }, 1);
  }, []);
  function onDismiss() {
    setOpened((prev) => !prev);
    setTimeout(() => {
      navigate(`/cart`);
    }, 100);
  }
  return (
    <Modal
      opened={opened}
      onClose={onDismiss}
      title={
        <Text size="xl" weight={700}>
          Checkout
        </Text>
      }
      size="xl"
    >
      <Form className="flex flex-col items-center p-5 space-y-5" method="post">
        <Text size="md">TBD</Text>
        <input hidden readOnly name="userId" value={profile.id} />
        <Button type="submit">Buy/Enroll</Button>
      </Form>
    </Modal>
  );
}

export default Checkout;
