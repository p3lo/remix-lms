import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import LessonQuiz from '~/components/learn/LessonQuiz';
import LessonText from '~/components/learn/LessonText';
import LessonVideo from '~/components/learn/LessonVideo';
import { supabaseStrategy } from '~/utils/auth.server';
import { prisma } from '~/utils/db.server';
import type { CourseLessons } from '~/utils/types';

export const loader: LoaderFunction = async ({ request }) => {
  const session = await supabaseStrategy.checkSession(request);
  const url = new URL(request.url);
  const lessonId = url.searchParams.get('id');
  invariant(lessonId, 'lessonId is required');
  const lesson = await prisma.course_content_lessons.findFirst({
    where: {
      AND: [
        {
          id: +lessonId,
        },
        {
          section: {
            course: {
              author: {
                email: session?.user?.email,
              },
            },
          },
        },
      ],
    },
    include: {
      quiz: {
        include: {
          question: {
            orderBy: { position: 'asc' },
            include: {
              answer: true,
            },
          },
        },
      },
    },
  });
  if (!lesson) {
    return redirect('/user/enrolled-courses');
  }
  return json({ lesson });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const action = formData.get('action');
  invariant(action, 'action is required');
  if (action === 'updateComplete') {
    const lessonId = formData.get('lessonId');
    const userId = formData.get('userId');
    invariant(lessonId, 'lessonId is required');
    invariant(userId, 'userId is required');
    const getProgressId = await prisma.course_progress.findFirst({
      where: {
        AND: [
          {
            lessonId: +lessonId,
          },
          {
            userId: +userId,
          },
        ],
      },
      select: {
        id: true,
      },
    });
    const completed = formData.get('completed');
    invariant(completed, 'completed is required');
    await prisma.course_progress.upsert({
      where: {
        id: getProgressId?.id || 0,
      },
      update: {
        isCompleted: completed === 'false',
      },
      create: {
        isCompleted: completed === 'false',
        lessonId: +lessonId,
        userId: +userId,
      },
    });
  }
  if (action === 'updateMarked') {
    const lessonId = formData.get('lessonId');
    const userId = formData.get('userId');
    invariant(lessonId, 'lessonId is required');
    invariant(userId, 'userId is required');
    const getProgressId = await prisma.course_progress.findFirst({
      where: {
        AND: [
          {
            lessonId: +lessonId,
          },
          {
            userId: +userId,
          },
        ],
      },
      select: {
        id: true,
      },
    });
    const courseId = formData.get('courseId');
    invariant(courseId, 'courseId is required');
    await prisma.course_progress.updateMany({
      where: {
        AND: [
          {
            lesson: {
              section: {
                course: {
                  id: +courseId,
                },
              },
            },
          },
          {
            userId: +userId,
          },
          {
            endedHere: true,
          },
        ],
      },
      data: {
        endedHere: false,
      },
    });
    await prisma.course_progress.upsert({
      where: {
        id: getProgressId?.id || 0,
      },
      update: {
        endedHere: true,
      },
      create: {
        endedHere: true,
        lessonId: +lessonId,
        userId: +userId,
      },
    });
  }
  if (action === 'getTabInfo') {
    console.log(formData.get('whatToGet'));
    return formData.get('whatToGet');
  }
  return null;
};

function LearnLesson() {
  // @ts-ignore
  const { lesson } = useLoaderData() as CourseLessons;
  return (
    <>
      {lesson.type === 'video' && <LessonVideo url={lesson.video} />}
      {lesson.type === 'text' && <LessonText text={lesson.textContent} />}
      {lesson.type === 'quiz' && <LessonQuiz quiz={lesson.quiz} />}
    </>
  );
}

export default LearnLesson;
