import { Button, Collapse, NumberInput, Switch } from '@mantine/core';
import type { ActionFunction } from '@remix-run/node';
import { Form, useMatches, useTransition } from '@remix-run/react';
import { useState } from 'react';
import invariant from 'tiny-invariant';
import { prisma } from '~/utils/db.server';
import type { Course } from '~/utils/types';

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const price = formData.get('price') as string;
  const free = formData.get('free') as string;
  const url = new URL(request.url);
  const slug = url.pathname.split('/')[2];
  invariant(price, 'Price is required');
  const priceNumber = price.split(' ')[1].trim().replace(/,/g, '');
  if (free) {
    await prisma.course.update({
      where: {
        slug,
      },
      data: {
        price: 0,
      },
    });
  } else {
    await prisma.course.update({
      where: {
        slug,
      },
      data: {
        price: +priceNumber,
      },
    });
  }
  return null;
};

function Payment() {
  const { course } = useMatches()[2].data as { course: Course };
  const [checked, setChecked] = useState(() => (course.price > 0 ? false : true));
  const transition = useTransition();
  const loader = transition.state === 'submitting' || transition.state === 'loading' ? true : false;
  return (
    <Form method="post" className="flex flex-col mt-10 space-y-2">
      <Switch
        className="mx-auto"
        checked={checked}
        onChange={(event) => setChecked(event.currentTarget.checked)}
        label="This is free course"
        name="free"
      />
      <Collapse in={!checked}>
        <NumberInput
          label="Course price"
          name="price"
          hideControls
          defaultValue={course.price || 0}
          parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
          formatter={(value) =>
            !Number.isNaN(parseFloat(value!)) ? `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '$ '
          }
        />
      </Collapse>
      <div className="flex pt-10">
        <Button className="w-[150px] mx-auto" type="submit" loading={loader}>
          Update
        </Button>
      </div>
    </Form>
  );
}

export default Payment;
