import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import CourseLessonQuizModal from '~/components/builder/CourseLessonQuizModal';

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const id = url.searchParams.get('sectionId');
  invariant(id, 'sectionId id is required');
  return json({ id });
};

function NewQuizLesson() {
  const { id } = useLoaderData() as { id: string };
  return <CourseLessonQuizModal sectionId={+id} type="new-quiz-lesson" />;
}

export default NewQuizLesson;
