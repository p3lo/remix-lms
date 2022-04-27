import { Button, Divider, Navbar, Text } from '@mantine/core';
import { Outlet } from '@remix-run/react';
import MainLayout from '~/components/layouts/main-layout/MainLayout';
import MainLink from '~/components/layouts/MainLink';
import { RiMoneyDollarCircleLine, RiFilePaper2Line, RiPencilLine } from 'react-icons/ri';

function CourseBuilderLayout() {
  return (
    <MainLayout>
      <div className="flex">
        <Navbar height={600} width={{ base: 250 }}>
          <Divider />
          <Navbar.Section>
            <Text className="flex justify-center py-3" size="md" weight={600}>
              Course builder menu
            </Text>
          </Navbar.Section>
          <Divider />
          <Navbar.Section grow mt="md">
            <div className="flex flex-col">
              <MainLink
                link="/user/profile-edit"
                icon={<RiPencilLine size={16} />}
                color="blue"
                label="Course details"
              />
              <MainLink
                link="/user/profile-picture"
                icon={<RiFilePaper2Line size={16} />}
                color="blue"
                label="Course content"
              />
              <MainLink
                link="/user/my-courses"
                icon={<RiMoneyDollarCircleLine size={16} />}
                color="blue"
                label="Payment information"
              />
            </div>
          </Navbar.Section>
          <Divider />
          <Navbar.Section className="flex">
            <Button className="mx-auto" m={15}>
              Submit for review
            </Button>
          </Navbar.Section>
        </Navbar>
        <div className="p-3 grow">
          <Outlet />
        </div>
      </div>
    </MainLayout>
  );
}

export default CourseBuilderLayout;
