import { Button, Modal, TextInput } from '@mantine/core';
import { useFocusTrap } from '@mantine/hooks';
import type { ActionFunction } from '@remix-run/node';
import { redirect, json } from '@remix-run/node';
import { Form, useActionData, useMatches, useNavigate } from '@remix-run/react';
import { useEffect, useState } from 'react';
import slugify from 'slugify';
import { prisma } from '~/utils/db.server';
import type { User } from '~/utils/types';

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const title = formData.get('title') as string;
  const id = formData.get('id') as string;
  const slug = slugify(title, { lower: true });
  const message = prisma.course
    .create({
      data: {
        title,
        slug,
        authorId: +id,
        subCategoryId: 1,
      },
    })
    .then(() => {
      return redirect(`/course-builder/${slug}`);
    })
    .catch((e) => {
      console.log(e);
      return json({ error: 'Course with same title already exists' });
    });
  return message;
};

function NewCourse() {
  const [opened, setOpened] = useState(false);
  const profile = useMatches()[0].data.profile as User;
  const error = useActionData() as { error: string | null };
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
        <input hidden readOnly value={profile.id} name="id" />
        <Button className="w-[150px] mx-auto" type="submit">
          Create course
        </Button>
      </Form>
    </Modal>
  );
}

export default NewCourse;
