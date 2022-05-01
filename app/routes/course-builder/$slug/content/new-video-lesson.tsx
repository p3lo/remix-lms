import { Button, Divider, LoadingOverlay, Modal, Paper, RingProgress, Switch, Text, TextInput } from '@mantine/core';
import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { Form, useLoaderData, useMatches, useNavigate, useSubmit, useTransition } from '@remix-run/react';
import { useEffect, useState } from 'react';
import invariant from 'tiny-invariant';
import { prisma } from '~/utils/db.server';
import type { Course } from '~/utils/types';
import Uppy from '@uppy/core';
import AwsS3Multipart from '@uppy/aws-s3-multipart';
import { FileInput, useUppy } from '@uppy/react';
import uppycore from '@uppy/core/dist/style.min.css';
import uppyfileinput from '@uppy/file-input/dist/style.css';
import { uppyOptions } from '~/utils/helpers';
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
  const sectionId = url.searchParams.get('section');
  invariant(sectionId, 'section id is required');
  const section = await prisma.course_content_sections.findUnique({
    where: { id: +sectionId },
    include: {
      lessons: true,
    },
  });
  const lastLesson = section?.lessons.pop();
  if (lastLesson) {
    return {};
  } else {
    return { section: sectionId, lessonPosition: 1 };
  }
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  console.log(formData);
  return null;
};

function NewVideoLesson() {
  const { course } = useMatches()[2].data as { course: Course };
  const loaderData = useLoaderData() as { section: string; lessonPosition: number };
  const [opened, setOpened] = useState(false);
  const navigate = useNavigate();
  const transition = useTransition();
  const loader = transition.state === 'submitting' || transition.state === 'loading' ? true : false;
  const [progressContent, setProgressContent] = useState(0);
  const [videoUrl, setVideoUrl] = useState('');
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
  }, []);
  function onDismiss() {
    setOpened((prev) => !prev);
    setTimeout(() => {
      navigate(`/course-builder/${course.slug}/content`);
    }, 100);
  }
  return (
    <Modal opened={opened} onClose={onDismiss} title="Add video lesson" size="lg">
      <Form method="post" className="flex flex-col space-y-3">
        <TextInput placeholder="Lesson title" label="Lesson title" required name="title" />
        <Switch defaultChecked={false} label="This lesson is free preview" name="free" />
        <TextInput placeholder="Lesson description (optional)" label="Lesson description" name="description" />
        <Divider my="xs" label="Video upload & preview" />
        <div className="flex space-x-2">
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
                onDuration={(duration) => console.log('duration', duration)}
              />
            </Paper>
          </div>
        </div>
        <input hidden value={loaderData.section} readOnly name="section_id" />
        <input hidden value={loaderData.lessonPosition} readOnly name="position" />
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
