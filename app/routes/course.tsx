import { Outlet } from '@remix-run/react';
import MainLayout from '~/components/layouts/main-layout/MainLayout';

function Course() {
  return (
    <MainLayout>
      <div className="px-0 py-10 xs:px-10 sm:px-16 md:px-20 xl:px-36">
        <Outlet />
      </div>
    </MainLayout>
  );
}

export default Course;
