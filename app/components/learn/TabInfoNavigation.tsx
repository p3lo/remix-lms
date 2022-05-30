import { Tabs } from '@mantine/core';
import { useLocation, useParams, useSearchParams } from '@remix-run/react';
import React from 'react';

function TabInfoNavigation() {
  let { tab } = useParams();
  console.log(tab);

  return (
    <Tabs grow>
      <Tabs.Tab label="Overview">First tab content</Tabs.Tab>
      <Tabs.Tab label="Q&A">Second tab content</Tabs.Tab>
      <Tabs.Tab label="Announcements">Third tab content</Tabs.Tab>
      <Tabs.Tab label="Reviews">Third tab content</Tabs.Tab>
    </Tabs>
  );
}

export default TabInfoNavigation;
