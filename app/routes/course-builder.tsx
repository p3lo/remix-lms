import { Button, Divider, Navbar, Text } from '@mantine/core';
import { Outlet, useLoaderData } from '@remix-run/react';
import MainLayout from '~/components/layouts/main-layout/MainLayout';
import MainLink from '~/components/layouts/MainLink';
import { RiMoneyDollarCircleLine, RiFilePaper2Line, RiPencilLine, RiImage2Line } from 'react-icons/ri';
import type { LoaderFunction } from '@remix-run/node';
import { redirect, json } from '@remix-run/node';

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const slug = url.pathname.split('/')[2];
  if (!slug) {
    return redirect('/user/my-courses');
  }
  return json({ slug });
};

function CourseBuilderLayout() {
  const { slug } = useLoaderData() as { slug: string };
  return (
    <MainLayout>
      <div className="flex h-full ">
        <Navbar className="h-[85vh] shadow-xl" width={{ base: 250 }}>
          <Divider size={0.5} />
          <Navbar.Section>
            <Text className="flex justify-center py-3" size="md" weight={600}>
              Course builder menu
            </Text>
          </Navbar.Section>
          <Divider size={0.5} />
          <Navbar.Section grow mt="md">
            <div className="flex flex-col">
              <MainLink
                link={`/course-builder/${slug}/details`}
                icon={<RiPencilLine size={16} />}
                color="blue"
                label="Course details"
              />
              <MainLink
                link={`/course-builder/${slug}/media`}
                icon={<RiImage2Line size={16} />}
                color="blue"
                label="Course UI"
              />
              <MainLink
                link={`/course-builder/${slug}/content`}
                icon={<RiFilePaper2Line size={16} />}
                color="blue"
                label="Course content"
              />
              <MainLink
                link={`/course-builder/${slug}/payment`}
                icon={<RiMoneyDollarCircleLine size={16} />}
                color="blue"
                label="Payment information"
              />
            </div>
          </Navbar.Section>
          <Divider size={0.5} />
          <Navbar.Section className="flex flex-col py-4 space-y-3">
            <Button className="mx-auto w-[200px]" color="red" mx={15}>
              Delete course
            </Button>
            <Button className="mx-auto w-[200px]" mx={15}>
              Submit for review
            </Button>
          </Navbar.Section>
          <Divider size={0.5} />
        </Navbar>
        <div className="p-3 grow">
          <Outlet />
        </div>
      </div>
    </MainLayout>
  );
}

export default CourseBuilderLayout;
