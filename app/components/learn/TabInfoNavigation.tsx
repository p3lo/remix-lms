import { Tabs } from '@mantine/core';
import { useScrollIntoView } from '@mantine/hooks';
import { useFetcher, useNavigate, useSearchParams } from '@remix-run/react';
import type { Course } from '~/utils/types';
import Overview from './TabInfoNavigation/Overview';
import Reviews from './TabInfoNavigation/Reviews';

function TabInfoNavigation({ course }: { course: Course }) {
  let [tab] = useSearchParams();
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const tabIndex = tab.get('tab');
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({ offset: 60 });
  const onTabsChange = (e: number) => {
    // const whatToGet = e === 0 ? 'overview' : e === 1 ? 'qa' : e === 2 ? 'announcements' : 'reviews';
    // fetcher.submit(
    //   { whatToGet, courseId: course.id.toString(), action: 'getTabInfo' },
    //   { method: 'post', action: `/learn/${course.slug}/lesson?id=${+tab.get('id')!}&tab=${e}` }
    // );
    navigate(`/learn/${course.slug}/lesson?id=${+tab.get('id')!}&tab=${e}`);
  };
  return (
    <div ref={targetRef}>
      <Tabs
        onClick={() => scrollIntoView({ alignment: 'center' })}
        tabPadding="lg"
        onTabChange={onTabsChange}
        initialTab={+tabIndex!}
        grow
      >
        <Tabs.Tab label="Overview">
          <Overview course={course} />
        </Tabs.Tab>
        <Tabs.Tab label="Q&A">{JSON.stringify(fetcher.data, null, 2)}</Tabs.Tab>
        <Tabs.Tab label="Announcements">{JSON.stringify(fetcher.data, null, 2)}</Tabs.Tab>
        <Tabs.Tab label="Reviews">
          <Reviews course={course} />
        </Tabs.Tab>
      </Tabs>
    </div>
  );
}

export default TabInfoNavigation;
