import type { LoaderFunction } from '@remix-run/node';
import { redirect, json } from '@remix-run/node';

import LearningLayout from '~/components/layouts/learning-layout/LearningLayout';
import { prisma } from '~/utils/db.server';

export const loader: LoaderFunction = async ({ params }) => {
  console.log(params.slug);
  const course = await prisma.course.findUnique({
    where: {
      slug: params.slug,
    },
  });
  if (!course) {
    return redirect('/');
  }
  return json({ course });
};

function LearningSlug() {
  return <LearningLayout>$slug</LearningLayout>;
}

export default LearningSlug;
