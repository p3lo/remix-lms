import type { LoaderFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useLoaderData, useMatches } from '@remix-run/react';
import PreviewModal from '~/components/PreviewModal';
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

function PreviewVideo() {
  const { sectionId, lessonId } = useLoaderData() as { sectionId: string; lessonId: string };
  const { course } = useMatches()[2].data as { course: Course };
  const section = course.content[getSectionIndex(course.content, +sectionId)];
  const lesson = section.lessons[getLessonIndex(section.lessons, +lessonId)];
  return (
    <PreviewModal url={lesson.video} title={lesson.lessonTitle} slug={course.slug} isBuilder={true}></PreviewModal>
  );
}

export default PreviewVideo;
