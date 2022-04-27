import { Button, Modal, TextInput } from '@mantine/core';
import { useFocusTrap } from '@mantine/hooks';
import type { ActionFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, useActionData, useNavigate } from '@remix-run/react';
import { useEffect, useState } from 'react';
import slugify from 'slugify';
import { prisma } from '~/utils/db.server';

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const title = formData.get('title') as string;
  const slug = slugify(title);
  const message = prisma.course
    .create({
      data: {
        title,
        slug,
      },
    })
    .then((result) => {
      return redirect(`/course-builder/${slug}`);
    })
    .catch(() => {
      return json({ error: 'Course with same title already exists' });
    });
  return message;
};

function NewCourse() {
  const [opened, setOpened] = useState(false);
  const error = useActionData() as { error: string | null };
  console.log(error);
  const navigate = useNavigate();
  const focusTrapRef = useFocusTrap();
  useEffect(() => {
    setTimeout(() => {
      setOpened((prev) => !prev);
    }, 1);
  }, []);
  function onDismiss() {
    setOpened((prev) => !prev);
    setTimeout(() => {
      navigate('/user/my-courses');
    }, 100);
  }
  return (
    <Modal opened={opened} onClose={onDismiss} title="Create new course" centered>
      <Form method="post" className="flex flex-col space-y-3" ref={focusTrapRef}>
        <TextInput
          placeholder="Course title"
          label="Title"
          required
          data-autofocus
          name="title"
          {...(error && { error: error.error })}
        />
        <Button className="w-[150px] mx-auto" type="submit">
          Create course
        </Button>
      </Form>
    </Modal>
  );
}

export default NewCourse;
