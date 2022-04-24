import { ActionIcon, Button, Text, useMantineColorScheme } from '@mantine/core';
import { useFetcher, useMatches } from '@remix-run/react';
import { Link } from '@remix-run/react';
import { BsSun, BsMoon } from 'react-icons/bs';
import { AiOutlineLogout } from 'react-icons/ai';

function Header() {
  const session = useMatches()[0].data.session;
  const logout = useFetcher();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
  return (
    <div className="flex items-center h-[50px] justify-between">
      <div>
        <Text className="px-3" weight={700} component={Link} to="/" size="xl">
          Remix LMS
        </Text>
      </div>
      <div></div>
      <div className="flex items-center space-x-3 pr-3">
        {session ? (
          <Button
            leftIcon={<AiOutlineLogout size={17} />}
            variant="outline"
            className="w-[100px] mx-auto"
            onClick={() => logout.submit(null, { method: 'post', action: '/logout' })}
          >
            Logout
          </Button>
        ) : (
          <>
            <Button component={Link} to="/login" variant="outline" className="w-[100px] mx-auto">
              Login
            </Button>

            <Button component={Link} to="/register" variant="light" className="w-[100px] mx-auto">
              Sign up
            </Button>
          </>
        )}
        <ActionIcon
          variant="outline"
          color={dark ? 'yellow' : 'blue'}
          onClick={() => toggleColorScheme()}
          title="Toggle color scheme"
        >
          {dark ? <BsSun size={18} className="text-yellow-400" /> : <BsMoon size={18} className="text-blue-500" />}
        </ActionIcon>
      </div>
    </div>
  );
}

export default Header;
