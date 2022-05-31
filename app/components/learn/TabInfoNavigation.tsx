import { Tabs } from '@mantine/core';
import { useFetcher, useSearchParams } from '@remix-run/react';

function TabInfoNavigation({ slug }: { slug: string }) {
  let [tab] = useSearchParams();
  const fetcher = useFetcher();
  console.log(fetcher.data);
  const tabIndex = tab.get('tab');
  const onTabsChange = (e: number) => {
    const whatToGet = e === 0 ? 'overview' : e === 1 ? 'qa' : e === 2 ? 'announcements' : 'reviews';
    fetcher.submit(
      { whatToGet, action: 'getTabInfo' },
      { method: 'post', action: `/learn/${slug}/lesson?id=${+tab.get('id')!}&tab=${e}` }
    );
  };
  return (
    <Tabs onTabChange={onTabsChange} initialTab={+tabIndex!} grow>
      <Tabs.Tab label="Overview">{fetcher.data}</Tabs.Tab>
      <Tabs.Tab label="Q&A">{fetcher.data}</Tabs.Tab>
      <Tabs.Tab label="Announcements">{fetcher.data}</Tabs.Tab>
      <Tabs.Tab label="Reviews">{fetcher.data}</Tabs.Tab>
    </Tabs>
  );
}

export default TabInfoNavigation;
