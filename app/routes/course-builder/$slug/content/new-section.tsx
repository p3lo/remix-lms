import { Button, Modal, TextInput } from '@mantine/core';
import { useFocusTrap } from '@mantine/hooks';
import type { ActionFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { Form, useMatches, useNavigate, useTransition } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { prisma } from '~/utils/db.server';
import type { Course } from '~/utils/types';

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const title = formData.get('title') as string;
  const position = formData.get('position') as string;
  const id = formData.get('id') as string;
  const url = new URL(request.url);
  const slug = url.pathname.split('/')[2];
  await prisma.course_content_sections.create({
    data: {
      sectionTitle: title,
      position: +position + 1,
      courseId: +id,
    },
  });
  return redirect(`/course-builder/${slug}/content`);
};

function NewSection() {
  const { course } = useMatches()[2].data as { course: Course };
  const [opened, setOpened] = useState(false);
  const navigate = useNavigate();
  const focusTrapRef = useFocusTrap();
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
    <Modal opened={opened} onClose={onDismiss} title="Add new section">
      <Form method="post" className="flex flex-col space-y-3" ref={focusTrapRef}>
        <TextInput placeholder="New section title" label="Title" required data-autofocus name="title" />
        <input hidden readOnly defaultValue={course.content?.at(-1)?.position || 0} name="position" />
        <input hidden readOnly defaultValue={course.id} name="id" />
        <Button className="w-[150px] mx-auto" type="submit" loading={loader}>
          Add section
        </Button>
      </Form>
    </Modal>
  );
}

export default NewSection;
