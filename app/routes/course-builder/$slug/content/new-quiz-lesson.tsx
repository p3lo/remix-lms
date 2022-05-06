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
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const duration = formData.get('duration') as string;
  const lessonCreate = await prisma.course_content_lessons.create({
    data: {
      sectionId: +sectionId,
      position: +position,
      lessonTitle: title,
      type: 'quiz',
      duration: +duration,
    },
  });
  const quizCreate = await prisma.quiz.create({
    data: {
      lessonId: lessonCreate.id,
    },
  });
  formData.forEach((value, key) => {
    if (key.startsWith('quiz-question')) {
      const position = key.split('-')[2];
      prisma.quiz_question
        .create({
          data: {
            quizId: quizCreate.id,
            question: value.toString(),
            position: +position,
          },
        })
        .then((result) => {
          formData.forEach(async (answer, key) => {
            if (key.startsWith(`quiz-answer-${position}`)) {
              const answerIndex = key.split('-')[3];
              const correct = formData.get(`quiz-correct-answer-${position}-${answerIndex}`) as string;
              let isCorrect = false;
              if (correct === 'on') {
                isCorrect = true;
              }
              await prisma.quiz_answer.create({
                data: {
                  questionId: result.id,
                  answer: answer.toString(),
                  isCorrect,
                },
              });
            }
          });
        });
    }
  });
  return redirect('/course-builder/' + slug + '/content');
};

function NewQuizLesson() {
  const { id } = useLoaderData() as { id: string };
  return <CourseLessonQuizModal sectionId={+id} type="new-quiz-lesson" />;
}

export default NewQuizLesson;
