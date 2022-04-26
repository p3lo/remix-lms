import { Group, Image, Paper, Text } from '@mantine/core';
import type { ActionFunction, UploadHandler } from '@remix-run/node';
import { unstable_parseMultipartFormData } from '@remix-run/node';
import { Form, useActionData, useMatches, useSubmit, useTransition } from '@remix-run/react';
import axios from 'axios';
import { s3_upload } from '~/utils/s3.server';
import type { User } from '~/utils/types';
import { IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { Dropzone } from '@mantine/dropzone';
import { prisma } from '~/utils/db.server';

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
      return unsigned_url.split('?')[0];
    } catch (error) {
      return 'error';
    }
  };
  const formData = await unstable_parseMultipartFormData(request, uploadHandler);
  const id = formData.get('id')!;
  const file = formData.getAll('file')[0] as string;
  if (file.startsWith('http') && id) {
    await prisma.user.update({
      where: { id: +id },
      data: {
        picture: file,
      },
    });
  }
  return file;
};

export const dropzoneChildren = () => (
  <Group position="center" spacing="xl" style={{ minHeight: 50, pointerEvents: 'none' }}>
    <div>
      <Text size="xl" inline>
        Drag image here or click to select file
      </Text>
      <Text size="sm" color="dimmed" inline mt={7}>
        Change your profile image. Picture shouldn't exceed 4MB.
      </Text>
    </div>
  </Group>
);

function ProfilePicture() {
  const profile = useMatches()[0].data.profile as User;
  const response = useActionData<string>();
  console.log(response);
  const transition = useTransition();
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
          loading={transition.state === 'submitting'}
          className="w-full mx-auto xs:w-3/4 md:w-2/3 h-[90px]"
          onDrop={(files) => console.log('accepted files', files)}
          onReject={(files) => console.log('rejected files', files)}
          maxSize={2 * 1024 ** 2}
          accept={IMAGE_MIME_TYPE}
          multiple={false}
          name="file"
        >
          {() => dropzoneChildren()}
        </Dropzone>
        <input hidden name="id" value={profile.id} readOnly />
      </Form>

      {response && response !== 'error' && (
        <Text size="sm" className="mx-auto">
          Image has been changed.
        </Text>
      )}

      {response && response === 'error' && (
        <Text size="sm" className="mx-auto">
          Image upload failed.
        </Text>
      )}
    </div>
  );
}

export default ProfilePicture;
