import { ActionIcon, Tabs, useMantineColorScheme } from '@mantine/core';
import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, Outlet, useLoaderData, useNavigate } from '@remix-run/react';
import { useState } from 'react';
import { RiKey2Line, RiPencilLine, RiArrowGoBackLine } from 'react-icons/ri';

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  if (url.pathname === '/register') {
    return json({ tab: 1 });
  } else {
    return json({ tab: 0 });
  }
};

function AuthLayout() {
  const { tab } = useLoaderData() as { tab: number };
  const [activeTab, setActiveTab] = useState<number>(tab);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
  let navigate = useNavigate();
  function tabChange(tabindex: number) {
    setActiveTab(tabindex);
    if (tabindex === 0) {
      navigate('/login', { replace: true });
    } else if (tabindex === 1) {
      navigate('/register', { replace: true });
    }
  }
  return (
    <>
      <ActionIcon className="w-5 h-5 mx-3 mt-3 " component={Link} to="/">
        <RiArrowGoBackLine />
      </ActionIcon>

      <div className="flex justify-center pt-[20vh] ">
        <div
          className={`w-[450px] flex flex-col space-y-3 border p-5 shadow ${dark && 'shadow-gray-400 border-gray-500'}`}
        >
          <Tabs active={activeTab} onTabChange={tabChange} grow>
            <Tabs.Tab label="Login" icon={<RiKey2Line size={16} />} />
            <Tabs.Tab label="Register" icon={<RiPencilLine size={16} />} />
          </Tabs>
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default AuthLayout;
