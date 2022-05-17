import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import PreviewModalQuiz from '~/components/PreviewModalQuiz';
import { prisma } from '~/utils/db.server';
import type { CourseLessons } from '~/utils/types';

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const lessonId = url.searchParams.get('lessonId');
  const slug = url.pathname.split('/')[2];
  if (!slug) {
    return redirect(`/`);
  }
  if (!lessonId) {
    return redirect(`/course/${slug}`);
  }
  const getLesson = await prisma.course_content_lessons.findUnique({
    where: {
      id: +lessonId,
    },
    include: {
      quiz: {
        include: {
          question: {
            include: {
              answer: true,
            },
          },
        },
      },
    },
  });
  if (!getLesson?.preview) {
    return redirect(`/course/${slug}`);
  }
  return json({ getLesson, slug });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const quiz = [] as any;
  for (let [key, value] of formData.entries()) {
    const qId = key.split('-')[1];
    const aId = value;
    const correctAId = await prisma.quiz_answer.findFirst({
      where: {
        questionId: +qId,
        isCorrect: true,
      },
      select: {
        id: true,
      },
    });
    quiz.push({ qId: +qId, aId: +aId, answer: +value, correctAId: correctAId?.id });
  }
  return quiz;
};

function PreviewQuiz() {
  const { getLesson, slug } = useLoaderData() as { getLesson: CourseLessons; slug: string };
  return <PreviewModalQuiz quiz={getLesson.quiz} title={getLesson.lessonTitle} slug={slug} isBuilder={false} />;
}

export default PreviewQuiz;
