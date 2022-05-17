import { ActionIcon, Avatar, Button, Divider, Indicator, Menu, Text, useMantineColorScheme } from '@mantine/core';
import { useFetcher, useMatches } from '@remix-run/react';
import { Link } from '@remix-run/react';
import { BsSun, BsMoon } from 'react-icons/bs';
import { AiOutlineLogout } from 'react-icons/ai';
import { CgProfile } from 'react-icons/cg';
import type { User } from '~/utils/types';
import { MdOutlineShoppingCart } from 'react-icons/md';

function Header() {
  const profile = useMatches()[0].data.profile as User;
  const logout = useFetcher();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
  return (
    <div className="flex items-center h-[70px] justify-between">
      <div className="">
        <Text
          className="px-3"
          weight={800}
          component={Link}
          to="/"
          size="xl"
          variant="gradient"
          gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}
          style={{ fontFamily: 'cursive, sans-serif' }}
        >
          Remix LMS
        </Text>
      </div>
      <div></div>
      <div className="flex items-center pr-3 space-x-3">
        {profile ? (
          <>
            <Menu
              trigger="hover"
              size={350}
              control={
                <Indicator inline label={profile.cart.length} size={12}>
                  <ActionIcon variant="transparent">
                    <MdOutlineShoppingCart className="cursor-pointer" size={24} />
                  </ActionIcon>
                </Indicator>
              }
            >
              <Menu.Label>My cart</Menu.Label>
              {profile.cart.map((cart) => (
                <Menu.Item key={cart.id} component={Link} to={`/course/${cart.course.slug}`}>
                  <Text size="sm" lineClamp={2}>
                    {cart.course.title}
                  </Text>
                </Menu.Item>
              ))}
              <Divider />
              <Menu.Item component={Link} to="/cart" color="blue">
                Go to cart
              </Menu.Item>
            </Menu>
            <Menu
              trigger="hover"
              control={<Avatar className="cursor-pointer" radius="xl" src={profile.picture} alt={profile.name} />}
            >
              <Menu.Label>{profile.name}</Menu.Label>
              <Menu.Item component={Link} to="/user/profile-edit" icon={<CgProfile size={14} />}>
                Profile
              </Menu.Item>
              <Divider />
              <Menu.Item
                icon={<AiOutlineLogout size={14} />}
                color="red"
                onClick={() => logout.submit(null, { method: 'post', action: '/logout' })}
              >
                Logout
              </Menu.Item>
            </Menu>
          </>
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
