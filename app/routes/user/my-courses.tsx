import { Button, UnstyledButton } from '@mantine/core';
import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, Outlet, useLoaderData } from '@remix-run/react';
import CourseContainerFrontCol from '~/components/ui/CourseContainerFrontCol';
import { supabaseStrategy } from '~/utils/auth.server';
import { prisma } from '~/utils/db.server';
import type { Course } from '~/utils/types';

export const loader: LoaderFunction = async ({ request }) => {
  const session = await supabaseStrategy.checkSession(request);
  const courses = await prisma.course.findMany({
    where: {
      author: {
        email: session?.user?.email,
      },
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
      whatYouLearn: true,
    },
  });
  return json({ courses });
};

function MyCourses() {
  const { courses } = useLoaderData() as { courses: Course[] };
  return (
    <>
      <Outlet />
      <div className="p-3">
        <Button component={Link} to="/user/my-courses/new">
          New course
        </Button>
      </div>
      <div className="flex items-center justify-evenly">
        {courses.map((course) => (
          <CourseContainerFrontCol key={course.id} course={course} owner />
        ))}
      </div>
    </>
  );
}

export default MyCourses;
