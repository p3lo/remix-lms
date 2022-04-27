import { Text } from '@mantine/core';
import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { supabaseStrategy } from '~/utils/auth.server';
import { prisma } from '~/utils/db.server';
import type { Course } from '~/utils/types';

export const loader: LoaderFunction = async ({ request }) => {
  const session = await supabaseStrategy.checkSession(request);
  const url = new URL(request.url);
  const slug = url.pathname.split('/')[2];
  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      author: true,
      whatYouLearn: true,
    },
  });
  console.log(session?.user?.email, course?.author?.email);
  if (session?.user?.email !== course?.author?.email) {
    return redirect('/user/my-courses');
  }
  return json({ course });
};

function CourseBuild() {
  const { course } = useLoaderData() as { course: Course };
  return (
    <>
      <Text size="xl" align="center" weight={500} m={15}>
        {course?.title}
      </Text>
      <div className="w-full mx-auto xs:w-3/4 md:w-2/3">
        <Outlet />
      </div>
    </>
  );
}

export default CourseBuild;
