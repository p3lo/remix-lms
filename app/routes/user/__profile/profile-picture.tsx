import { Image, Paper, Text } from '@mantine/core';
import { useMatches } from '@remix-run/react';
import type { User } from '~/utils/types';

function ProfilePicture() {
  const profile = useMatches()[0].data.profile as User;
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
    </div>
  );
}

export default ProfilePicture;
