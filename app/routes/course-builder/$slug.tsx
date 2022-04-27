import { Text } from '@mantine/core';
import { Outlet } from '@remix-run/react';

function CourseBuild() {
  return (
    <>
      <Text size="xl" align="center" weight={500} m={15}>
        CourseBuild
      </Text>
      <Outlet />
    </>
  );
}

export default CourseBuild;
