import type { LoaderFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { prisma } from '~/utils/db.server';

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const slug = url.pathname.split('/')[2];
  if (!slug) {
    return redirect('/');
  }
  const course = await prisma.course.findUnique({
    where: {
      slug,
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
      whatYouLearn: true,
      subCategory: {
        select: {
          name: true,
        },
      },
      content: {
        orderBy: { position: 'asc' },
        include: {
          lessons: {
            orderBy: { position: 'asc' },
            select: {
              lessonTitle: true,
              description: true,
              duration: true,
              type: true,
              preview: true,
            },
          },
        },
      },
    },
  });
  console.log(course);
  return json({ course });
};

function Course() {
  return <div>Course</div>;
}

export default Course;
