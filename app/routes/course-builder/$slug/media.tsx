import { Divider, Image, Paper } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE, MIME_TYPES } from '@mantine/dropzone';
import type { ActionFunction, UploadHandler } from '@remix-run/node';
import { unstable_parseMultipartFormData } from '@remix-run/node';
import { Form, useMatches, useSubmit, useTransition } from '@remix-run/react';
import axios from 'axios';
import ReactPlayer from 'react-player';
import { dropzoneChildren } from '~/routes/user/profile-picture';
import { prisma } from '~/utils/db.server';
import { s3_upload } from '~/utils/s3.server';
import type { Course } from '~/utils/types';

export const action: ActionFunction = async ({ request }) => {
  const uploadHandler: UploadHandler = async ({ name, stream, mimetype, filename }) => {
    const splitted = name.split('-');
    if (splitted[0] !== 'file') {
      stream.resume();
      return;
    }
    const unsigned_url = await s3_upload(`course/${splitted[1]}/`, filename, mimetype);

    await axios
      .put(unsigned_url, stream, {
        headers: {
          'Content-Type': mimetype,
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      })
      .then(async () => {
        if (splitted[2] === 'image') {
          await prisma.course.update({
            where: { id: +splitted[1] },
            data: {
              image: unsigned_url.split('?')[0],
            },
          });
        } else {
          await prisma.course.update({
            where: { id: +splitted[1] },
            data: {
              preview: unsigned_url.split('?')[0],
            },
          });
        }
      })
      .catch(() => {
        return 'error';
      })
      .finally(() => {
        return 'done';
      });
    return 'done';
  };
  const formData = await unstable_parseMultipartFormData(request, uploadHandler);

  let getkey: string = '';
  formData.forEach((_, key) => {
    getkey = key;
  });
  const file = formData.getAll(getkey)[0] as string;
  if (!file) {
    return null;
  }

  return file;
};

function Media() {
  const { course } = useMatches()[2].data as { course: Course };

  const transition = useTransition();
  const submit = useSubmit();
  function handlechange(event: React.ChangeEvent<HTMLFormElement>) {
    submit(event.currentTarget, { replace: true });
  }
  return (
    <div className="flex flex-col space-y-5 mb-10">
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
        <Form method="post" encType="multipart/form-data" onChange={handlechange}>
          <Dropzone
            loading={transition.state === 'submitting'}
            className="h-[100px]"
            onDrop={(files) => console.log('accepted files', files)}
            onReject={(files) => console.log('rejected files', files)}
            maxSize={2 * 1024 * 2}
            accept={IMAGE_MIME_TYPE}
            multiple={false}
            name={`file-${course.id}-image`}
          >
            {() => dropzoneChildren("Change your cover image. Picture shouldn't exceed 4MB.")}
          </Dropzone>
        </Form>
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
        <Form method="post" encType="multipart/form-data" onChange={handlechange}>
          <Dropzone
            loading={transition.state === 'submitting'}
            className="h-[100px]"
            onDrop={(files) => console.log('accepted files', files)}
            onReject={(files) => console.log('rejected files', files)}
            maxSize={20 * 1024 * 2}
            accept={[MIME_TYPES.mp4]}
            multiple={false}
            name={`file-${course.id}-preview`}
          >
            {() => dropzoneChildren("Change your preview video. Video shouldn't exceed 40MB.")}
          </Dropzone>
        </Form>
      </div>
    </div>
  );
}

export default Media;
