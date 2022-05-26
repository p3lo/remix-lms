import type { LoaderFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import { prisma } from '~/utils/db.server';

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const slug = url.pathname.split('/')[2];
  if (!slug) {
    redirect('/user/enrolled-courses');
  }

  const totalLessonsDb = prisma.course_content_lessons.count({
    where: {
      section: {
        course: {
          slug,
        },
      },
    },
  });
  const completedLessonsDb = prisma.course_progress.count({
    where: {
      AND: [
        {
          lesson: {
            section: {
              course: {
                slug,
              },
            },
          },
        },
        {
          isCompleted: true,
        },
      ],
    },
  });
  const [totalLessons, completedLessons] = await prisma.$transaction([totalLessonsDb, completedLessonsDb]);
  const statistics = { totalLessons, completedLessons, percent: Math.round((completedLessons / totalLessons) * 100) };
  return json({ statistics });
};

function Learn() {
  return (
    <>
      <Outlet />
    </>
  );
}

export default Learn;
