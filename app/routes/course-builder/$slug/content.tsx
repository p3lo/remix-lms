import { Accordion, Button } from '@mantine/core';
import { Link, Outlet, useMatches, useTransition } from '@remix-run/react';
import { RiAddCircleLine } from 'react-icons/ri';
import type { Course } from '~/utils/types';

function Content() {
  const { course } = useMatches()[2].data as { course: Course };

  return (
    <>
      <Outlet />
      <div className="flex flex-col space-y-5">
        <Accordion multiple>
          {course.content &&
            course.content.map((section) => (
              <Accordion.Item key={section.id} label={section.sectionTitle}>
                <p>kokot</p>
              </Accordion.Item>
            ))}
        </Accordion>
        <div className="flex justify-center">
          <Button
            component={Link}
            to={`/course-builder/${course.slug}/content/new-section`}
            variant="subtle"
            leftIcon={<RiAddCircleLine size={17} />}
            className="w-[200px]"
          >
            Add new section
          </Button>
        </div>
      </div>
    </>
  );
}

export default Content;
