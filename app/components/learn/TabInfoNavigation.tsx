import { Tabs } from '@mantine/core';
import { useScrollIntoView } from '@mantine/hooks';
import { useFetcher, useNavigate, useSearchParams } from '@remix-run/react';
import type { Course } from '~/utils/types';
import Announcements from './TabInfoNavigation/Announcements';
import Overview from './TabInfoNavigation/Overview';
import QA from './TabInfoNavigation/QA';
import Reviews from './TabInfoNavigation/Reviews';

function TabInfoNavigation({ course }: { course: Course }) {
  let [tab] = useSearchParams();
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const tabIndex = tab.get('tab');
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({ offset: 60 });
  const onTabsChange = (e: number) => {
    scrollIntoView({ alignment: 'center' });
    navigate(`/learn/${course.slug}/lesson?id=${+tab.get('id')!}&tab=${e}`);
  };
  return (
    <div ref={targetRef}>
      <Tabs tabPadding="lg" onTabChange={onTabsChange} initialTab={+tabIndex!} grow>
        <Tabs.Tab label="Overview">
          <Overview course={course} />
        </Tabs.Tab>
        <Tabs.Tab label="Q&A">
          <QA courseId={course.id} slug={course.slug} owner={course.author} />
        </Tabs.Tab>
        <Tabs.Tab label="Announcements">
          <Announcements courseId={course.id} slug={course.slug} owner={course.author} />
        </Tabs.Tab>
        <Tabs.Tab label="Reviews">
          <Reviews course={course} />
        </Tabs.Tab>
      </Tabs>
    </div>
  );
}

export default TabInfoNavigation;
