import { Button, Collapse, InputWrapper, Loader, LoadingOverlay, TextInput } from '@mantine/core';
import { useFetcher, useMatches, useSearchParams } from '@remix-run/react';
import * as React from 'react';
import { RichText } from '~/components/RichText';
import type { CourseAnnouncements, User } from '~/utils/types';
import AnnouncementPost from './Announcements/AnnouncementPost';

function Announcements({ courseId, slug, owner }: { courseId: number; slug: string; owner: User }) {
  const fetcher = useFetcher();
  const announcementsFetcher = useFetcher();
  const getData = useMatches()[0];
  const userId = getData?.data.profile.id;
  const [announcements, setAnnouncements] = React.useState<CourseAnnouncements[]>([]);
  const [addAnnouncementOpened, setAddAnnouncementOpened] = React.useState(false);
  const [value, onChange] = React.useState('');
  const loader = fetcher.state === 'submitting' || fetcher.state === 'loading' ? true : false;
  let [params] = useSearchParams();
  React.useEffect(() => {
    fetcher.submit(
      { whatToGet: 'announcements', courseId: courseId.toString(), userId: userId.toString(), action: 'getTabInfo' },
      { method: 'post', action: `/learn/${slug}/lesson` }
    );
  }, []);
  React.useEffect(() => {
    // setAnnouncements((prev) => [...(prev || []), ...(fetcher.data?.announcements || [])]);
    setAnnouncements(fetcher.data?.announcements || []);
  }, [fetcher.data?.announcements]);
  React.useEffect(() => {
    setAnnouncements((prev) => [...(announcementsFetcher.data?.announ || []), ...(prev || [])]);
    // setAnnouncements((prev) => [...(prev || []), ...(fetcher.data?.announcements || [])]);
  }, [announcementsFetcher?.data]);

  return (
    <div className="relative flex flex-col p-5 space-y-4">
      <LoadingOverlay loader={<Loader variant="dots" />} visible={loader} />
      {owner.id === userId && (
        <>
          <Button onClick={() => setAddAnnouncementOpened((o) => !o)} variant="subtle" className="w-[200px]">
            Add Announcement
          </Button>
          <Collapse in={addAnnouncementOpened}>
            <announcementsFetcher.Form
              method="post"
              action={`/learn/${slug}/lesson?id=${+params.get('id')!}&tab=${+params.get('tab')!}`}
            >
              <input hidden name="action" value="submitAnnouncement" readOnly />
              <input hidden name="courseId" value={courseId} readOnly />
              <input hidden name="userId" value={userId} readOnly />
              <input hidden name="rte" value={value} readOnly />
              <TextInput placeholder="Title" label="Title" name="title" defaultValue="" />
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
              <Button type="submit" mt={15}>
                Submit
              </Button>
            </announcementsFetcher.Form>
          </Collapse>
        </>
      )}
      {announcements.map((announcement) => (
        <AnnouncementPost key={announcement.id} announcement={announcement} owner={owner} />
      ))}
    </div>
  );
}

export default Announcements;
