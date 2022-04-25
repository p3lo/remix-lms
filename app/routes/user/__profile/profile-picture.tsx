import { Image, Paper, Text } from '@mantine/core';
import type { ActionFunction } from '@remix-run/node';
import { useActionData, useMatches } from '@remix-run/react';
import S3Upload from '~/components/S3Upload';
import { s3_upload } from '~/utils/s3.server';
import type { User } from '~/utils/types';

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const file = formData.get('file')!;
  return s3_upload('test/', file);
};

function ProfilePicture() {
  const profile = useMatches()[0].data.profile as User;
  const presignedUrl = useActionData() as string;
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
        className="w-full xs:w-3/4 md:w-2/3 mx-auto "
      >
        <Image fit="contain" height={300} src={profile.picture} />
      </Paper>
      <S3Upload presigned={presignedUrl} />
    </div>
  );
}

export default ProfilePicture;
