import {
  ActionIcon,
  Avatar,
  Button,
  Collapse,
  Divider,
  InputWrapper,
  Text,
  TextInput,
  Title,
  TypographyStylesProvider,
} from '@mantine/core';
import * as React from 'react';
import ReactTimeago from 'react-timeago';
import type { CourseAnnouncements, User } from '~/utils/types';
import { RiDeleteBin6Line, RiEditBoxLine } from 'react-icons/ri';
import { RichText } from '~/components/RichText';
import { useFetcher, useSearchParams } from '@remix-run/react';

function AnnouncementPost({
  announcement,
  owner,
  slug,
}: {
  announcement: CourseAnnouncements;
  owner: User;
  slug: string;
}) {
  const updateFetcher = useFetcher();
  const deleteFetcher = useFetcher();
  let [params] = useSearchParams();
  const [value, onChange] = React.useState(announcement.announcement);
  const [title, setTitle] = React.useState(announcement.title);
  const [showTitle, setShowTitle] = React.useState(announcement.title);
  const [showAnnoun, setShowAnnoun] = React.useState(announcement.announcement);
  const [updateAnnouncementOpened, setUpdateAnnouncementOpened] = React.useState(false);
  const [deleteAnnouncementOpened, setDeleteAnnouncementOpened] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);
  React.useEffect(() => {
    if (deleteFetcher?.data?.success === true) {
      setHidden(true);
    }
  }, [deleteFetcher?.data?.success]);
  React.useEffect(() => {
    if (updateFetcher?.data?.update === true) {
      setShowTitle(title);
      setShowAnnoun(value);
    }
  }, [updateFetcher?.data?.update]);
  return (
    <div className="flex flex-col space-y-1" hidden={hidden}>
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
      <Title order={4}>{showTitle}</Title>
      <TypographyStylesProvider>
        <div dangerouslySetInnerHTML={{ __html: showAnnoun }} />
      </TypographyStylesProvider>
      {owner.id === announcement.userId && (
        <>
          <div className="flex space-x-1">
            <ActionIcon variant="hover" onClick={() => setUpdateAnnouncementOpened((o) => !o)}>
              <RiEditBoxLine color="cyan" size={16} />
            </ActionIcon>
            <ActionIcon variant="hover" onClick={() => setDeleteAnnouncementOpened((o) => !o)}>
              <RiDeleteBin6Line color="red" size={16} />
            </ActionIcon>
          </div>
          <Collapse in={updateAnnouncementOpened}>
            <updateFetcher.Form
              method="post"
              action={`/learn/${slug}/lesson?id=${+params.get('id')!}&tab=${+params.get('tab')!}`}
            >
              <input hidden name="action" value="updateAnnouncement" readOnly />
              <input hidden name="announcementId" value={announcement.id} readOnly />
              <input hidden name="rte" value={value} readOnly />
              <TextInput
                placeholder="Title"
                label="Title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.currentTarget.value)}
              />
              <InputWrapper label="Announcement">
                <RichText
                  controls={[['bold', 'italic']]}
                  id="rte"
                  value={value}
                  onChange={onChange}
                  placeholder="Announcement"
                  spellCheck={false}
                />
              </InputWrapper>
              <Button type="submit" mt={15} onClick={() => setUpdateAnnouncementOpened((o) => !o)}>
                Update
              </Button>
            </updateFetcher.Form>
          </Collapse>
          <Collapse in={deleteAnnouncementOpened}>
            <deleteFetcher.Form
              method="post"
              action={`/learn/${slug}/lesson?id=${+params.get('id')!}&tab=${+params.get('tab')!}`}
            >
              <input hidden name="action" value="deleteAnnouncement" readOnly />
              <input hidden name="announcementId" value={announcement.id} readOnly />
              <Button color="red" type="submit" mt={15}>
                Delete
              </Button>
            </deleteFetcher.Form>
          </Collapse>
        </>
      )}
      <Divider />
    </div>
  );
}

export default AnnouncementPost;
