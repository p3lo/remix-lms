import { Group, Image, Paper, Text } from '@mantine/core';
import type { ActionFunction, UploadHandler } from '@remix-run/node';
import { json } from '@remix-run/node';
import { unstable_parseMultipartFormData } from '@remix-run/node';
import { Form, useActionData, useMatches, useSubmit, useTransition } from '@remix-run/react';
import axios from 'axios';
import { s3_upload } from '~/utils/s3.server';
import type { User } from '~/utils/types';
import type { DropzoneStatus } from '@mantine/dropzone';
import { MIME_TYPES } from '@mantine/dropzone';
import { Dropzone } from '@mantine/dropzone';

export const action: ActionFunction = async ({ request }) => {
  const uploadHandler: UploadHandler = async ({ name, stream, mimetype, filename }) => {
    if (name !== 'file') {
      stream.resume();
      return;
    }
    const unsigned_url = await s3_upload('test/', filename, mimetype);
    try {
      await axios.put(unsigned_url, stream, {
        headers: {
          'Content-Type': mimetype,
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      });
      return JSON.stringify({ success: true, response: 'Upload complete' });
    } catch (error) {
      return JSON.stringify({ success: false, response: error });
    }
  };
  const formData = await unstable_parseMultipartFormData(request, uploadHandler);
  const file = formData.getAll('file');
  return json(file.toString());
};

export const dropzoneChildren = () => (
  <Group position="center" spacing="xl" style={{ minHeight: 50, pointerEvents: 'none' }}>
    <div>
      <Text size="xl" inline>
        Drag images here or click to select files
      </Text>
      <Text size="sm" color="dimmed" inline mt={7}>
        Attach as many files as you like, each file should not exceed 5mb
      </Text>
    </div>
  </Group>
);

function ProfilePicture() {
  const profile = useMatches()[0].data.profile as User;
  const file = useActionData() as string;
  const transition = useTransition();
  const submission = transition.state === 'submitting' ? true : false;
  const submit = useSubmit();
  function handlechange(event: React.ChangeEvent<HTMLFormElement>) {
    submit(event.currentTarget, { replace: true });
  }
  return (
    <div className="flex flex-col space-y-3">
      <Text className="flex justify-center p-3" size="xl" weight={700}>
        Profile picture
      </Text>
      <Paper
        sx={(theme) => ({
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[9] : theme.colors.gray[2],
        })}
        shadow="md"
        p="sm"
        withBorder
        className="w-full mx-auto xs:w-3/4 md:w-2/3 "
      >
        <Image fit="contain" height={300} src={profile.picture} />
      </Paper>
      <Form method="post" encType="multipart/form-data" onChange={handlechange}>
        <Dropzone
          loading={submission}
          className="w-full mx-auto xs:w-3/4 md:w-2/3 h-[90px]"
          onDrop={(files) => console.log('accepted files', files)}
          onReject={(files) => console.log('rejected files', files)}
          maxSize={32 * 1024 ** 2}
          accept={[MIME_TYPES.mp4]}
          multiple={false}
          name="file"
        >
          {() => dropzoneChildren()}
        </Dropzone>
      </Form>
    </div>
  );
}

export default ProfilePicture;
