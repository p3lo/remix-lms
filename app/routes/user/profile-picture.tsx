import { Image, Paper, RingProgress, Text } from '@mantine/core';
import type { ActionFunction } from '@remix-run/node';
import { useActionData, useMatches, useSubmit } from '@remix-run/react';
import type { User } from '~/utils/types';
import { prisma } from '~/utils/db.server';
import Uppy from '@uppy/core';
import AwsS3Multipart from '@uppy/aws-s3-multipart';
import { FileInput, useUppy } from '@uppy/react';
import uppycore from '@uppy/core/dist/style.min.css';
import uppyfileinput from '@uppy/file-input/dist/style.css';
import { useState } from 'react';
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
  console.log(url, id);
  await prisma.user
    .update({
      where: { id: +id },
      data: {
        picture: url,
      },
    })
    .catch(() => {
      return 'error';
    });
  return 'done';
};

function ProfilePicture() {
  const profile = useMatches()[0].data.profile as User;
  const response = useActionData<string>();
  const submit = useSubmit();
  const [progress, setProgress] = useState(0);
  const uppy = useUppy(() => {
    return new Uppy(uppyOptions('avatar', ['image/*'], 5, `profile/${profile.id}`))
      .use(AwsS3Multipart, {
        limit: 4,
        companionUrl: 'https://companion.dev.p3lo.com/',
        retryDelays: [0, 1000, 3000, 5000],
      })
      .on('complete', async (result) => {
        const url = result.successful[0].uploadURL;
        setProgress(0);
        submit({ url, id: profile.id.toString() }, { method: 'post', replace: true });
      })
      .on('upload-progress', (file, progress) => {
        setProgress(Math.floor((progress.bytesUploaded / progress.bytesTotal) * 100));
        // console.log(file.id, progress.bytesUploaded, progress.bytesTotal);
      });
  });
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
      <div className="flex flex-col space-y-1">
        <div className="mx-auto">
          <FileInput uppy={uppy} pretty inputName="files[]" locale={{ strings: { chooseFiles: 'Choose file' } }} />
        </div>
        {progress > 0 && (
          <RingProgress
            className="mx-auto"
            sections={[{ value: progress, color: 'blue' }]}
            size={80}
            thickness={10}
            label={
              <Text color="blue" weight={400} align="center" size="xs">
                {progress}%
              </Text>
            }
          />
        )}
      </div>

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
