import { ActionIcon, useMantineColorScheme } from '@mantine/core';
import { useFetcher, useMatches } from '@remix-run/react';
import { Link } from '@remix-run/react';
import { BsSun, BsMoon } from 'react-icons/bs';

function Header() {
  const session = useMatches()[0].data.session;
  const logout = useFetcher();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
  console.log(session, dark);
  return (
    <div>
      <ActionIcon
        variant="outline"
        color={dark ? 'yellow' : 'blue'}
        onClick={() => toggleColorScheme()}
        title="Toggle color scheme"
      >
        {dark ? <BsSun size={18} className="text-yellow-400" /> : <BsMoon size={18} className="text-blue-500" />}
      </ActionIcon>
      {session ? (
        <button onClick={() => logout.submit(null, { method: 'post', action: '/logout' })}>Logout</button>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </div>
  );
}

export default Header;
