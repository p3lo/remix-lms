import { Accordion, AccordionItem, ActionIcon, Button, Text, useMantineColorScheme } from '@mantine/core';
import { Link, Outlet, useMatches } from '@remix-run/react';
import { RiAddCircleLine, RiDeleteBin6Line, RiEditBoxLine } from 'react-icons/ri';
import CourseLessonList from '~/components/CourseLessonList';
import { sumTime } from '~/utils/helpers';
import type { Course } from '~/utils/types';

function Content() {
  const { course } = useMatches()[2].data as { course: Course };
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  return (
    <>
      <Outlet />
      <div className="flex flex-col ">
        {course.content &&
          course.content.map((section) => (
            <div key={section.id} className="flex items-start space-x-1">
              <Accordion className="grow" multiple>
                <AccordionItem
                  key={section.id}
                  label={
                    <div className="flex items-center justify-between">
                      <Text size="lg">{section.sectionTitle}</Text>
                      <Text>{sumTime(section)}</Text>
                    </div>
                  }
                >
                  {section.lessons.map((lesson) => (
                    <div key={lesson.id} className={`flex flex-col mb-3 p-1 ${dark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                      <CourseLessonList lesson={lesson} slug={course.slug} sectionId={section.id} />
                    </div>
                  ))}
                  <div className="flex flex-col md:flex-row">
                    <Button
                      component={Link}
                      to={`/course-builder/${course.slug}/content/new-video-lesson?sectionId=${section.id}`}
                      variant="subtle"
                      leftIcon={<RiAddCircleLine size={17} />}
                      className="w-full md:w-[33.33%]"
                      color="cyan"
                      size="xs"
                    >
                      Add video lesson
                    </Button>
                    <Button
                      component={Link}
                      to={`/course-builder/${course.slug}/content/new-text-lesson?sectionId=${section.id}`}
                      variant="subtle"
                      leftIcon={<RiAddCircleLine size={17} />}
                      className="w-full md:w-[33.33%]"
                      color="green"
                      size="xs"
                    >
                      Add text lesson
                    </Button>
                    <Button
                      component={Link}
                      to={`/course-builder/${course.slug}/content/new-quiz-lesson?sectionId=${section.id}`}
                      variant="subtle"
                      leftIcon={<RiAddCircleLine size={17} />}
                      className="w-full md:w-[33.33%]"
                      color="gray"
                      size="xs"
                    >
                      Add quiz
                    </Button>
                  </div>
                </AccordionItem>
              </Accordion>
              <ActionIcon
                mt={15}
                component={Link}
                to={`/course-builder/${course.slug}/content/edit-section?sectionId=${section.id}`}
              >
                <RiEditBoxLine color="cyan" size={15} />
              </ActionIcon>
              <ActionIcon
                mt={15}
                component={Link}
                to={`/course-builder/${course.slug}/content/delete-section?sectionId=${section.id}`}
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
