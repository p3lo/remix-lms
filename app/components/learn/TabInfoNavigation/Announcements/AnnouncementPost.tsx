import { Avatar, Text, Title, TypographyStylesProvider } from '@mantine/core';
import * as React from 'react';
import ReactTimeago from 'react-timeago';
import type { CourseAnnouncements, User } from '~/utils/types';

function AnnouncementPost({ announcement, owner }: { announcement: CourseAnnouncements; owner: User }) {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <Avatar radius="xl" src={owner.picture} />
        <div className="flex flex-col">
          <Text weight={700}>{owner.name}</Text>
          <div className="flex items-center space-x-1">
            <Text size="xs">posted an announcement</Text>
            <Text size="xs">·</Text>
            <ReactTimeago className="text-xs" date={announcement.createdAt} />
          </div>
        </div>
      </div>
      <Title order={4}>{announcement.title}</Title>
      <TypographyStylesProvider>
        <div dangerouslySetInnerHTML={{ __html: announcement.announcement }} />
      </TypographyStylesProvider>
    </div>
  );
}

export default AnnouncementPost;
