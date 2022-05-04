import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import CourseLessonTextModal from '~/components/builder/CourseLessonTextModal';
import { prisma } from '~/utils/db.server';

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const sectionId = url.searchParams.get('sectionId');
  const lessonId = url.searchParams.get('lessonId');
  invariant(sectionId, 'sectionId id is required');
  invariant(lessonId, 'lessonId id is required');
  return json({ sectionId, lessonId });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const title = formData.get('title') as string;
  const description = formData.get('description') as string | '';
  const freePreview = formData.get('free') as string;
  const slug = formData.get('slug') as string;
  const duration = formData.get('duration') as string;
  const content = formData.get('content') as string;
  const lessonId = formData.get('lesson') as string;

  let preview = false;
  if (freePreview === 'on') {
    preview = true;
  }
  await prisma.course_content_lessons.update({
    where: {
      id: +lessonId,
    },
    data: {
      lessonTitle: title,
      description,
      preview,
      duration: +duration,
      textContent: content,
    },
  });
  return redirect('/course-builder/' + slug + '/content');
};

function EditTextLesson() {
  const { sectionId, lessonId } = useLoaderData() as { sectionId: string; lessonId: string };
  return <CourseLessonTextModal sectionId={+sectionId} type="edit-text-lesson" lessonId={+lessonId} />;
}

export default EditTextLesson;
