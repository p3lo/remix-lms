import type { LoaderFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import PreviewModal from '~/components/PreviewModal';
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
  });
  if (!getLesson?.preview) {
    return redirect(`/course/${slug}`);
  }
  return json({ getLesson, slug });
};

function PreviewVideoCourse() {
  const { getLesson, slug } = useLoaderData() as { getLesson: CourseLessons; slug: string };

  return (
    <PreviewModal url={getLesson.video} title={getLesson.lessonTitle} slug={slug} isBuilder={false}></PreviewModal>
  );
}

export default PreviewVideoCourse;
