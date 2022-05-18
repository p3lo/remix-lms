import { Avatar, Divider, Navbar, Paper, Tabs, Text } from '@mantine/core';
import { Link, Outlet, useMatches } from '@remix-run/react';
import MainLayout from '~/components/layouts/main-layout/MainLayout';
import type { User } from '~/utils/types';
import { CgProfile, CgImage } from 'react-icons/cg';
import { GiTeacher, GiTabletopPlayers } from 'react-icons/gi';
import MainLink from '~/components/layouts/MainLink';

function ProfileLayout() {
  const profile = useMatches()[0].data.profile as User;

  return (
    <MainLayout>
      <div className="flex">
        <Navbar className="h-[85vh] shadow-xl w-[250px] my-2">
          {/* <Divider className="opacity-50" /> */}
          <Navbar.Section>
            <Text className="flex justify-center py-3" size="md" weight={600}>
              Profile menu
            </Text>
          </Navbar.Section>
          <Divider className="opacity-50" />
          <Navbar.Section grow mt="md">
            <div className="flex flex-col">
              <MainLink link="/user/profile-edit" icon={<CgProfile size={16} />} color="blue" label="Profile" />
              <MainLink
                link="/user/profile-picture"
                icon={<CgImage size={16} />}
                color="blue"
                label="Profile picture"
              />
              <MainLink link="/user/my-courses" icon={<GiTeacher size={16} />} color="blue" label="My courses" />
              <MainLink
                link="/user/enrolled-courses"
                icon={<GiTabletopPlayers size={16} />}
                color="blue"
                label="Enrolled courses"
              />
            </div>
          </Navbar.Section>
          <Divider className="opacity-50" />
          <Navbar.Section>
            <div className="flex flex-col items-center justify-center p-3">
              <Avatar className="mb-3" size="lg" radius="xl" src={profile.picture} alt={profile.name} />
              <Text size="sm" weight={500}>
                {profile.name}
              </Text>
              <Text size="xs" weight={300}>
                {profile.headline}
              </Text>
            </div>
          </Navbar.Section>
          {/* <Divider className="opacity-50" /> */}
        </Navbar>
        <div className="p-3 grow w-[80%]">
          <Outlet />
        </div>
      </div>
    </MainLayout>
  );
}

export default ProfileLayout;
