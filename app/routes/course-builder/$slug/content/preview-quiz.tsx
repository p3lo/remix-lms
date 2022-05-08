import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useLoaderData, useMatches } from '@remix-run/react';
import PreviewModalQuiz from '~/components/PreviewModalQuiz';
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
  const { sectionId, lessonId } = useLoaderData() as { sectionId: string; lessonId: string };
  const { course } = useMatches()[2].data as { course: Course };
  const section = course.content[getSectionIndex(course.content, +sectionId)];
  const lesson = section.lessons[getLessonIndex(section.lessons, +lessonId)];
  return <PreviewModalQuiz quiz={lesson.quiz} title={lesson.lessonTitle} slug={course.slug} />;
}

export default PreviewQuiz;
