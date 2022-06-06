import { Tabs } from '@mantine/core';
import { useFetcher, useNavigate, useSearchParams } from '@remix-run/react';
import type { Course } from '~/utils/types';
import Overview from './TabInfoNavigation/Overview';

function TabInfoNavigation({ course }: { course: Course }) {
  let [tab] = useSearchParams();
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const tabIndex = tab.get('tab');
  const onTabsChange = (e: number) => {
    const whatToGet = e === 0 ? 'overview' : e === 1 ? 'qa' : e === 2 ? 'announcements' : 'reviews';
    fetcher.submit(
      { whatToGet, courseId: course.id.toString(), action: 'getTabInfo' },
      { method: 'post', action: `/learn/${course.slug}/lesson?id=${+tab.get('id')!}&tab=${e}` }
    );
    navigate(`/learn/${course.slug}/lesson?id=${+tab.get('id')!}&tab=${e}`);
  };
  return (
    <Tabs tabPadding="lg" onTabChange={onTabsChange} initialTab={+tabIndex!} grow>
      <Tabs.Tab label="Overview">
        <Overview course={course} />
      </Tabs.Tab>
      <Tabs.Tab label="Q&A">{JSON.stringify(fetcher.data, null, 2)}</Tabs.Tab>
      <Tabs.Tab label="Announcements">{JSON.stringify(fetcher.data, null, 2)}</Tabs.Tab>
      <Tabs.Tab label="Reviews">{JSON.stringify(fetcher.data, null, 2)}</Tabs.Tab>
    </Tabs>
  );
}

export default TabInfoNavigation;
