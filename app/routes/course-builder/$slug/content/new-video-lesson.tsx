import {
  Button,
  Divider,
  LoadingOverlay,
  Modal,
  Paper,
  RingProgress,
  Select,
  Switch,
  Text,
  TextInput,
} from '@mantine/core';
import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, useActionData, useLoaderData, useMatches, useNavigate, useTransition } from '@remix-run/react';
import { useEffect, useState } from 'react';
import invariant from 'tiny-invariant';
import { prisma } from '~/utils/db.server';
import type { Course } from '~/utils/types';
import Uppy from '@uppy/core';
import AwsS3Multipart from '@uppy/aws-s3-multipart';
import { FileInput, useUppy } from '@uppy/react';
import uppycore from '@uppy/core/dist/style.min.css';
import uppyfileinput from '@uppy/file-input/dist/style.css';
import { getLessonPosition, getSectionIndex, uppyOptions } from '~/utils/helpers';
import ReactPlayer from 'react-player';

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
  const { course } = useMatches()[2].data as { course: Course };
  const { id } = useLoaderData() as { id: string };
  const sectionIndex = getSectionIndex(course.content, +id);
  const actionData = useActionData() as { error: string };
  const [opened, setOpened] = useState(false);
  const navigate = useNavigate();
  const transition = useTransition();
  const loader = transition.state === 'submitting' || transition.state === 'loading' ? true : false;
  const [progressContent, setProgressContent] = useState(0);
  const [lessonPosition, setLessonPosition] = useState(0);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoDuration, setVideoDuration] = useState(0);
  const [selectDestination, setSelectDestination] = useState<string>('cloud');
  const uppyContent = useUppy(() => {
    return new Uppy(uppyOptions('content', ['video/*'], 400, `course/${course.id}/content`))
      .use(AwsS3Multipart, {
        limit: 4,
        companionUrl: 'https://companion.dev.p3lo.com/',
        retryDelays: [0, 1000, 3000, 5000],
      })
      .on('complete', async (result) => {
        const url = result.successful[0].uploadURL;
        setProgressContent(0);
        setVideoUrl(url);
      })
      .on('upload-progress', (file, progress) => {
        setProgressContent(Math.floor((progress.bytesUploaded / progress.bytesTotal) * 100));
        // console.log(file.id, progress.bytesUploaded, progress.bytesTotal);
      });
  });
  useEffect(() => {
    setTimeout(() => {
      setOpened((prev) => !prev);
    }, 1);
    setLessonPosition(getLessonPosition(course.content[sectionIndex].lessons));
  }, []);

  useEffect(() => {
    setVideoUrl('');
  }, [selectDestination]);

  function onDismiss() {
    setOpened((prev) => !prev);
    setTimeout(() => {
      navigate(`/course-builder/${course.slug}/content`);
    }, 100);
  }
  return (
    <Modal opened={opened} onClose={onDismiss} title="Add video lesson" size="lg">
      <Form method="post" action={`?section=${id}`} className="flex flex-col space-y-3">
        <TextInput placeholder="Lesson title" label="Lesson title" required name="title" />
        <Switch defaultChecked={false} label="This lesson is free preview" name="free" />
        <TextInput placeholder="Lesson description (optional)" label="Lesson description" name="description" />
        <Divider my="xs" label="Video upload & preview" />
        <div className="flex md:flex-row md:space-x-2 md:space-y-0 flex-col space-y-2 items-center">
          <Select
            label="Choose video source"
            placeholder="Pick one"
            defaultValue={selectDestination}
            onChange={setSelectDestination as any}
            className="w-full md:w-1/2"
            name="select"
            data={[
              { value: 'cloud', label: 'Upload' },
              { value: 'youtube', label: 'Youtube' },
              { value: 'vimeo', label: 'Vimeo' },
            ]}
          />
          {selectDestination !== 'cloud' && (
            <TextInput
              className="w-full md:w-1/2"
              placeholder="Video url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              required
              label="Video url"
              name="noncloud_video_url"
            />
          )}
        </div>
        {actionData?.error && (
          <Text size="xs" color="red">
            {actionData.error}
          </Text>
        )}
        <div className="flex space-x-2">
          {selectDestination === 'cloud' && (
            <div className="flex flex-col space-y-1">
              <form className="relative mx-auto">
                <LoadingOverlay loaderProps={{ size: 'xs', variant: 'bars' }} visible={progressContent > 0} />
                <FileInput
                  uppy={uppyContent}
                  pretty
                  inputName="files[]"
                  locale={{ strings: { chooseFiles: 'Choose video' } }}
                />
              </form>

              {progressContent > 0 && (
                <RingProgress
                  className="mx-auto"
                  sections={[{ value: progressContent, color: 'blue' }]}
                  size={80}
                  thickness={10}
                  label={
                    <Text color="blue" weight={400} align="center" size="xs">
                      {progressContent}%
                    </Text>
                  }
                />
              )}
            </div>
          )}
          <div className="grow">
            <Paper
              sx={(theme) => ({
                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[9] : theme.colors.gray[2],
              })}
              shadow="md"
              p="sm"
              withBorder
            >
              <ReactPlayer
                config={{
                  file: {
                    attributes: {
                      onContextMenu: (e: Event) => e.preventDefault(),
                      controlsList: 'nodownload',
                    },
                  },
                }}
                controls
                width="100%"
                height={220}
                url={videoUrl}
                onDuration={(duration) => setVideoDuration(Math.floor(duration))}
              />
            </Paper>
          </div>
        </div>
        <TextInput
          placeholder="Video duration"
          label="Video duration (seconds)"
          type="number"
          required
          name="duration"
          value={videoDuration}
          onChange={(e) => setVideoDuration(+e.target.value)}
        />
        <input hidden value={id} readOnly name="section" />
        <input hidden value={lessonPosition} readOnly name="position" />
        <input hidden value={videoUrl} readOnly name="video_url" />
        <input hidden value={course.slug} readOnly name="slug" />
        <Button className="w-[150px] mx-auto" type="submit" loading={loader}>
          Add lesson
        </Button>
      </Form>
    </Modal>
  );
}

export default NewVideoLesson;
