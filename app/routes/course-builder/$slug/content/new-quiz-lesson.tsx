import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { redirect, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import CourseLessonQuizModal from '~/components/builder/CourseLessonQuizModal';
import { prisma } from '~/utils/db.server';

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const id = url.searchParams.get('sectionId');
  invariant(id, 'sectionId id is required');
  return json({ id });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const sectionId = formData.get('section') as string;
  const position = formData.get('position') as string;
  const slug = formData.get('slug') as string;
  const duration = formData.get('duration') as string;
  const data = formData.forEach((value, key) => {
    if (key.startsWith('quiz-question')) {
    }
  });
  const toDb = prisma.course_content_lessons.create({
    data: {
      sectionId: +sectionId,
      position: +position,
      lessonTitle: 'New Quiz Lesson',
      type: 'quiz',
      duration: +duration,
      quiz: {
        create: {
          question: {
            create: [
              {
                question: '',
                position: 0,
                answer: {
                  create: [
                    {
                      answer: '',
                      isCorrect: true,
                    },
                  ],
                },
              },
            ],
          },
        },
      },
    },
  });
  console.log(formData);
  return null;
  // return redirect('/course-builder/' + slug + '/content');
};

function NewQuizLesson() {
  const { id } = useLoaderData() as { id: string };
  return <CourseLessonQuizModal sectionId={+id} type="new-quiz-lesson" />;
}

export default NewQuizLesson;
