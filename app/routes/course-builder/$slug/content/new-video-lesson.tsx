import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { redirect, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import CourseLessonModal from '~/components/builder/CourseLessonModal';
import uppycore from '@uppy/core/dist/style.min.css';
import uppyfileinput from '@uppy/file-input/dist/style.css';
import { prisma } from '~/utils/db.server';

export function links() {
  return [
    {
      rel: 'stylesheet',
      href: uppycore,
    },
    {
      rel: 'stylesheet',
      href: uppyfileinput,
    },
  ];
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const id = url.searchParams.get('section');
  invariant(id, 'section id is required');
  return json({ id });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const title = formData.get('title') as string;
  const sectionId = formData.get('section') as string;
  const description = formData.get('description') as string | '';
  const select = formData.get('select') as string;
  const freePreview = formData.get('free') as string;
  const position = formData.get('position') as string;
  const slug = formData.get('slug') as string;
  const video_url = formData.get('video_url') as string;
  const noncloud_video_url = formData.get('noncloud_video_url') as string;
  const duration = formData.get('duration') as string;
  if (select === 'cloud' && !video_url) {
    return { error: 'Video was not uploaded, please upload it first or set url' };
  }
  let url = '';
  if (select === 'cloud') {
    url = video_url;
  } else {
    url = noncloud_video_url;
  }
  let preview = false;
  if (freePreview === 'on') {
    preview = true;
  }
  await prisma.course_content_lessons.create({
    data: {
      lessonTitle: title,
      description,
      position: +position,
      video: url,
      sectionId: +sectionId,
      preview,
      duration: +duration,
    },
  });
  return redirect('/course-builder/' + slug + '/content');
};

function NewVideoLesson() {
  const { id } = useLoaderData() as { id: string };
  return <CourseLessonModal id={+id} type="new" />;
}

export default NewVideoLesson;
