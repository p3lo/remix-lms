import { Accordion, AccordionItem, ActionIcon, Button } from '@mantine/core';
import { Link, Outlet, useMatches } from '@remix-run/react';
import { RiAddCircleLine, RiDeleteBin6Line, RiEditBoxLine } from 'react-icons/ri';
import type { Course } from '~/utils/types';

function Content() {
  const { course } = useMatches()[2].data as { course: Course };

  return (
    <>
      <Outlet />
      <div className="flex flex-col ">
        {course.content &&
          course.content.map((section) => (
            <div key={section.id} className="flex items-start space-x-1">
              <Accordion className="grow" multiple>
                <AccordionItem key={section.id} label={section.sectionTitle}>
                  <div className="flex flex-col md:flex-row">
                    <Button
                      component={Link}
                      to={`/course-builder/${course.slug}/content/new-video-lesson?section=${section.id}`}
                      variant="subtle"
                      leftIcon={<RiAddCircleLine size={17} />}
                      className="w-full md:w-[33%]"
                      color="cyan"
                    >
                      Add video lesson
                    </Button>
                    <Button
                      component={Link}
                      to={`/course-builder/${course.slug}/content/new-text-lesson?section=${section.id}`}
                      variant="subtle"
                      leftIcon={<RiAddCircleLine size={17} />}
                      className="w-full md:w-[33%]"
                      color="green"
                    >
                      Add text lesson
                    </Button>
                    <Button
                      component={Link}
                      to={`/course-builder/${course.slug}/content/new-quiz?section=${section.id}`}
                      variant="subtle"
                      leftIcon={<RiAddCircleLine size={17} />}
                      className="w-full md:w-[33%]"
                      color="gray"
                    >
                      Add quiz
                    </Button>
                  </div>
                </AccordionItem>
              </Accordion>
              <ActionIcon
                component={Link}
                to={`/course-builder/${course.slug}/content/edit-section?section=${section.id}`}
              >
                <RiEditBoxLine color="cyan" size={15} />
              </ActionIcon>
              <ActionIcon
                component={Link}
                to={`/course-builder/${course.slug}/content/delete-section?section=${section.id}`}
              >
                <RiDeleteBin6Line color="red" size={15} />
              </ActionIcon>
            </div>
          ))}

        <div className="flex justify-center mt-5">
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
