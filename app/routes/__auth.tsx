import { Tabs } from '@mantine/core';
import { Outlet } from '@remix-run/react';
import { useState } from 'react';

function AuthLayout() {
  const [activeTab, setActiveTab] = useState(1);
  return (
    <div className="flex justify-center pt-[20vh]">
      <div className="w-[400px] flex flex-col space-y-3">
        <Tabs active={activeTab} onTabChange={setActiveTab} grow>
          <Tabs.Tab label="Login" />
          <Tabs.Tab label="Register" />
        </Tabs>
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
