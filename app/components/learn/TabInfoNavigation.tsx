import { Tabs } from '@mantine/core';
import { useNavigate, useSearchParams } from '@remix-run/react';

function TabInfoNavigation() {
  let [tab] = useSearchParams();
  const tabIndex = tab.get('tab');
  const navigate = useNavigate();
  const onTabsChange = (e: number) => {
    navigate(`lesson?id=${+tab.get('id')!}&tab=${e}`);
  };
  return (
    <Tabs onTabChange={onTabsChange} initialTab={+tabIndex!} grow>
      <Tabs.Tab label="Overview">First tab content</Tabs.Tab>
      <Tabs.Tab label="Q&A">Second tab content</Tabs.Tab>
      <Tabs.Tab label="Announcements">Third tab content</Tabs.Tab>
      <Tabs.Tab label="Reviews">Third tab content</Tabs.Tab>
    </Tabs>
  );
}

export default TabInfoNavigation;
