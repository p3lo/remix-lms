import { Button, Modal, Text } from '@mantine/core';
import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, useLoaderData, useMatches, useNavigate, useTransition } from '@remix-run/react';
import { useEffect, useState } from 'react';
import invariant from 'tiny-invariant';
import { prisma } from '~/utils/db.server';
import { getLessonIndex, getSectionIndex } from '~/utils/helpers';
import type { Course } from '~/utils/types';

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const sectionId = url.searchParams.get('sectionId');
  const lessonId = url.searchParams.get('lessonId');
  const slug = url.pathname.split('/')[2];
  if (!sectionId || !lessonId) {
    return redirect(`/course-builder/${slug}/content`);
  }
  return json({ sectionId, lessonId });
};

export const action: ActionFunction = async ({ request }) => {
  const url = new URL(request.url);
  const sectionId = url.searchParams.get('sectionId');
  const lessonId = url.searchParams.get('lessonId');
  const slug = url.pathname.split('/')[2];

  invariant(sectionId, 'section id is required');
  invariant(lessonId, 'lesson id is required');
  await prisma.course_content_lessons.delete({
    where: { id: +lessonId },
  });
  return redirect(`/course-builder/${slug}/content`);
};

function DeleteLesson() {
  const { sectionId, lessonId } = useLoaderData() as { sectionId: string; lessonId: string };
  const { course } = useMatches()[2].data as { course: Course };
  const sectionIndex = getSectionIndex(course.content, +sectionId);
  const section = course.content[sectionIndex];
  const [opened, setOpened] = useState(false);
  const navigate = useNavigate();
  const lesson = section.lessons[getLessonIndex(section.lessons, +lessonId)];
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
    <Modal opened={opened} onClose={onDismiss} title="Delete lesson">
      <Form
        method="post"
        action={`/course-builder/${course.slug}/content/delete-lesson?sectionId=${section.id}&lessonId=${lesson.id}`}
        className="flex flex-col space-y-3"
      >
        <Text size="sm">"{lesson.lessonTitle}"?</Text>
        <Button className="w-[150px] mx-auto" color="red" type="submit" loading={loader}>
          Delete
        </Button>
      </Form>
    </Modal>
  );
}

export default DeleteLesson;
