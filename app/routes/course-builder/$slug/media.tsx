import { Divider, Image, Paper, RingProgress, Text } from '@mantine/core';
import type { ActionFunction } from '@remix-run/node';
import { useMatches, useSubmit } from '@remix-run/react';
import AwsS3Multipart from '@uppy/aws-s3-multipart';
import Uppy from '@uppy/core';
import { FileInput, useUppy } from '@uppy/react';
import { useState } from 'react';
import ReactPlayer from 'react-player';
import { prisma } from '~/utils/db.server';
import type { Course } from '~/utils/types';
import uppycore from '@uppy/core/dist/style.min.css';
import uppyfileinput from '@uppy/file-input/dist/style.css';
import { uppyOptions } from '~/utils/helpers';

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

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const url = formData.get('url') as string;
  const id = formData.get('id') as string;
  const type = formData.get('type') as string;
  if (type === 'image') {
    await prisma.course
      .update({
        where: { id: +id },
        data: {
          image: url,
        },
      })
      .catch(() => {
        return 'error';
      });
  } else if (type === 'preview') {
    await prisma.course
      .update({
        where: { id: +id },
        data: {
          preview: url,
        },
      })
      .catch(() => {
        return 'error';
      });
  }
  return 'done';
};

function Media() {
  const { course } = useMatches()[2].data as { course: Course };
  const [progressImage, setProgressImage] = useState(0);
  const [progressPreview, setProgressPreview] = useState(0);
  const submit = useSubmit();
  const uppyImage = useUppy(() => {
    return new Uppy(uppyOptions('image', ['image/*'], 5, `course/${course.id}`))
      .use(AwsS3Multipart, {
        limit: 4,
        companionUrl: 'https://companion.dev.p3lo.com/',
        retryDelays: [0, 1000, 3000, 5000],
      })
      .on('complete', async (result) => {
        const url = result.successful[0].uploadURL;
        setProgressImage(0);
        submit({ url, id: course.id.toString(), type: 'image' }, { method: 'post', replace: true });
      })
      .on('upload-progress', (file, progress) => {
        setProgressImage(Math.floor((progress.bytesUploaded / progress.bytesTotal) * 100));
        // console.log(file.id, progress.bytesUploaded, progress.bytesTotal);
      });
  });
  const uppyPreview = useUppy(() => {
    return new Uppy(uppyOptions('preview', ['video/*'], 40, `course/${course.id}`))
      .use(AwsS3Multipart, {
        limit: 4,
        companionUrl: 'https://companion.dev.p3lo.com/',
        retryDelays: [0, 1000, 3000, 5000],
      })
      .on('complete', async (result) => {
        const url = result.successful[0].uploadURL;
        setProgressPreview(0);
        submit({ url, id: course.id.toString(), type: 'preview' }, { method: 'post', replace: true });
      })
      .on('upload-progress', (file, progress) => {
        setProgressPreview(Math.floor((progress.bytesUploaded / progress.bytesTotal) * 100));
        // console.log(file.id, progress.bytesUploaded, progress.bytesTotal);
      });
  });

  return (
    <div className="flex flex-col mb-10 space-y-5">
      <div className="flex flex-col space-y-2">
        <Divider label="Course image" />
        <Paper
          sx={(theme) => ({
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[9] : theme.colors.gray[2],
          })}
          shadow="md"
          p="sm"
          withBorder
        >
          <Image
            fit="contain"
            height={220}
            src={course.image}
            alt="With default placeholder"
            {...(!course.image && { withPlaceholder: true })}
          />
        </Paper>
        <div className="flex flex-col space-y-1">
          <div className="mx-auto">
            <FileInput
              uppy={uppyImage}
              pretty
              inputName="files[]"
              locale={{ strings: { chooseFiles: 'Choose image' } }}
            />
          </div>

          {progressImage > 0 && (
            <RingProgress
              className="mx-auto"
              sections={[{ value: progressImage, color: 'blue' }]}
              size={80}
              thickness={10}
              label={
                <Text color="blue" weight={400} align="center" size="xs">
                  {progressImage}%
                </Text>
              }
            />
          )}
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        <Divider label="Course video preview" />
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
            url={course.preview}
            onDuration={(duration) => console.log('duration', duration)}
          />
        </Paper>
        <div className="flex flex-col">
          <div className="mx-auto">
            <FileInput
              uppy={uppyPreview}
              pretty
              inputName="files[]"
              locale={{ strings: { chooseFiles: 'Choose video' } }}
            />
          </div>
          {progressPreview > 0 && (
            <RingProgress
              className="mx-auto"
              size={80}
              thickness={10}
              sections={[{ value: progressPreview, color: 'blue' }]}
              label={
                <Text color="blue" weight={400} align="center" size="xs">
                  {progressPreview}%
                </Text>
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Media;
