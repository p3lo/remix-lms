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
          <UnstyledButton
            key={course.id}
            className="w-full xs:w-1/2 sm:w-1/3 md:w-1/4 xl:w-1/5 h-[300px]"
            component={Link}
            to={`/course/${course.slug}`}
          >
            <CourseContainerFrontCol course={course} owner />
          </UnstyledButton>
        ))}
      </div>
    </>
  );
}

export default MyCourses;
