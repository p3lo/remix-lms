import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import CourseLessonTextModal from '~/components/builder/CourseLessonTextModal';
import { prisma } from '~/utils/db.server';

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const id = url.searchParams.get('sectionId');
  invariant(id, 'sectionId id is required');
  return json({ id });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const title = formData.get('title') as string;
  const sectionId = formData.get('section') as string;
  const description = formData.get('description') as string | '';
  const freePreview = formData.get('free') as string;
  const position = formData.get('position') as string;
  const slug = formData.get('slug') as string;
  const duration = formData.get('duration') as string;
  const content = formData.get('content') as string;

  let preview = false;
  if (freePreview === 'on') {
    preview = true;
  }
  await prisma.course_content_lessons.create({
    data: {
      lessonTitle: title,
      description,
      position: +position,
      sectionId: +sectionId,
      preview,
      duration: +duration,
      textContent: content,
      type: 'text',
    },
  });
  return redirect('/course-builder/' + slug + '/content');
};

function NewTextLesson() {
  const { id } = useLoaderData() as { id: string };
  return <CourseLessonTextModal sectionId={+id} type="new-text-lesson" />;
}

export default NewTextLesson;
