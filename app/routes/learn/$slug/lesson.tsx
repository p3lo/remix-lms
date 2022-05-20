import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
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

function LearnLesson() {
  // @ts-ignore
  const { lesson } = useLoaderData() as CourseLessons;
  return <>{lesson.type === 'video' && <LessonVideo url={lesson.video} />}</>;
}

export default LearnLesson;
