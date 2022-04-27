import { Button } from '@mantine/core';
import { Link, Outlet } from '@remix-run/react';

function MyCourses() {
  return (
    <>
      <Outlet />
      <div>
        <Button component={Link} to="/user/my-courses/new">
          New course
        </Button>
      </div>
    </>
  );
}

export default MyCourses;
