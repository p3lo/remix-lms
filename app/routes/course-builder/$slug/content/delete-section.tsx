import { Button, Modal, Text } from '@mantine/core';
import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { redirect, json } from '@remix-run/node';
import { Form, useLoaderData, useMatches, useNavigate, useTransition } from '@remix-run/react';
import { useEffect, useState } from 'react';
import invariant from 'tiny-invariant';
import { prisma } from '~/utils/db.server';
import type { Course, CourseSections } from '~/utils/types';

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const id = url.searchParams.get('section');
  const slug = url.pathname.split('/')[2];
  if (!id) {
    return redirect(`/course-builder/${slug}/content`);
  }
  invariant(id, 'section id is required');
  const section = await prisma.course_content_sections.findUnique({
    where: { id: +id },
  });

  return json({ section });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const url = new URL(request.url);
  const id = formData.get('id') as string;
  const slug = url.pathname.split('/')[2];

  invariant(id, 'section id is required');
  await prisma.course_content_sections.delete({
    where: { id: +id },
  });
  return redirect(`/course-builder/${slug}/content`);
};

function DeleteSection() {
  const { section } = useLoaderData() as { section: CourseSections };
  const { course } = useMatches()[2].data as { course: Course };
  const [opened, setOpened] = useState(false);
  const navigate = useNavigate();
  const transition = useTransition();
  const loader = transition.state === 'submitting' || transition.state === 'loading' ? true : false;
  useEffect(() => {
    setTimeout(() => {
      setOpened((prev) => !prev);
    }, 1);
  }, []);
  function onDismiss() {
    setOpened((prev) => !prev);
    setTimeout(() => {
      navigate(`/course-builder/${course.slug}/content`);
    }, 100);
  }
  return (
    <Modal opened={opened} onClose={onDismiss} title="Delete section">
      <Form method="post" className="flex flex-col space-y-3">
        <Text size="sm">"{section.sectionTitle}"?</Text>
        <input hidden readOnly name="id" value={section.id} />
        <Button className="w-[150px] mx-auto" color="red" type="submit" loading={loader}>
          Delete
        </Button>
      </Form>
    </Modal>
  );
}

export default DeleteSection;
