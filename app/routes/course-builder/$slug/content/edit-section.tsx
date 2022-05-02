import { Button, Modal, TextInput } from '@mantine/core';
import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { redirect, json } from '@remix-run/node';
import { Form, useLoaderData, useMatches, useNavigate, useTransition } from '@remix-run/react';
import { useEffect, useState } from 'react';
import invariant from 'tiny-invariant';
import { prisma } from '~/utils/db.server';
import { getSectionIndex } from '~/utils/helpers';
import type { Course } from '~/utils/types';

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  const slug = url.pathname.split('/')[2];
  if (!id) {
    return redirect(`/course-builder/${slug}/content`);
  }
  invariant(id, 'id is required');

  return json({ id });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const title = formData.get('title') as string;
  const url = new URL(request.url);
  const id = formData.get('id') as string;
  const slug = url.pathname.split('/')[2];

  invariant(id, 'section id is required');
  await prisma.course_content_sections.update({
    where: { id: +id },
    data: { sectionTitle: title },
  });
  return redirect(`/course-builder/${slug}/content`);
};

function EditSection() {
  const { id } = useLoaderData() as { id: string };
  const { course } = useMatches()[2].data as { course: Course };
  const sectionIndex = getSectionIndex(course.content, +id);
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
    <Modal opened={opened} onClose={onDismiss} title="Update section title">
      <Form method="post" className="flex flex-col space-y-3">
        <TextInput
          placeholder="Section title"
          label="Section title"
          required
          name="title"
          defaultValue={course.content[sectionIndex].sectionTitle}
        />

        <input hidden readOnly name="id" value={course.content[sectionIndex].id} />
        <Button className="w-[150px] mx-auto" type="submit" loading={loader}>
          Update
        </Button>
      </Form>
    </Modal>
  );
}

export default EditSection;
