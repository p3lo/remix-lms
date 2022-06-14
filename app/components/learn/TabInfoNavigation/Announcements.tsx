import { Loader, LoadingOverlay } from '@mantine/core';
import { useFetcher, useMatches } from '@remix-run/react';
import * as React from 'react';

function Announcements() {
  const fetcher = useFetcher();
  const getData = useMatches()[0];
  const userId = getData?.data.profile.id;
  const loader = fetcher.state === 'submitting' || fetcher.state === 'loading' ? true : false;
  return (
    <div className="flex flex-col p-5 space-y-4 relative">
      <LoadingOverlay loader={<Loader variant="dots" />} visible={loader} />
      Announcements
    </div>
  );
}

export default Announcements;
