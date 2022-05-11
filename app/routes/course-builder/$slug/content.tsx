import { Accordion, AccordionItem, ActionIcon, Button, Text, useMantineColorScheme } from '@mantine/core';
import { Link, Outlet, useMatches, useSubmit } from '@remix-run/react';
import { RiAddCircleLine, RiDeleteBin6Line, RiEditBoxLine } from 'react-icons/ri';
import CourseLessonList from '~/components/CourseLessonList';
import { sumTime } from '~/utils/helpers';
import type { Course, CourseLessons, CourseSections } from '~/utils/types';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useCallback, useEffect, useState } from 'react';
import update from 'immutability-helper';
import { DivAccordionDND } from '~/components/builder/DivAccordionDND';
import { DivAccordionItemDND } from '~/components/builder/DivAccordionItemDND';
import type { ActionFunction } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { prisma } from '~/utils/db.server';

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const action = formData.get('action') as string;
  invariant(action, 'action is required');

  if (action === 'accordionItem') {
    const getLessons = formData.get('lessons');
    const indexContent = formData.get('indexQ');
    invariant(indexContent, 'index content is required');
    invariant(getLessons, 'lessons is required');
    const lessons = JSON.parse(getLessons.toString()) as CourseLessons[];
    await prisma.$transaction(
      lessons.map((lesson, index) =>
        prisma.course_content_lessons.update({ where: { id: lesson.id }, data: { position: index } })
      )
    );
  }
  if (action === 'accordion') {
    const getSections = formData.get('sections');
    invariant(getSections, 'sections is required');
    const sections = JSON.parse(getSections.toString()) as CourseSections[];
    await prisma.$transaction(
      sections.map((section, index) =>
        prisma.course_content_sections.update({ where: { id: section.id }, data: { position: index } })
      )
    );
  }
  return null;
};

function Content() {
  const { course } = useMatches()[2].data as { course: Course };
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
  const submit = useSubmit();
  const [items, setItems] = useState(course);
  useEffect(() => {
    setItems(course);
  }, [course]);

  const moveAccordion = useCallback((dragIndex: number, hoverIndex: number) => {
    setItems((prev: any) =>
      update(prev, {
        content: {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prev.content[dragIndex]],
          ],
        },
      })
    );
  }, []);
  const moveAccordionItem = useCallback(
    (dragIndex: number, hoverIndex: number, indexQ: number) => {
      const lessons = Object.assign(items.content[indexQ].lessons);
      setItems((prev: any) =>
        update(prev, {
          content: {
            [indexQ]: {
              lessons: {
                $splice: [
                  [dragIndex, 1],
                  [hoverIndex, 0, lessons[dragIndex]],
                ],
              },
            },
          },
        })
      );
    },

    [items]
  );
  const moveAccordionCompleted = useCallback(
    (index: number, itemIndex: number) => {
      const getSections = course.content;
      const sections = Object.assign(
        update(getSections, {
          $splice: [
            [itemIndex, 1],
            [index, 0, getSections[itemIndex]],
          ],
        })
      );
      submit(
        {
          action: 'accordion',
          sections: JSON.stringify(sections),
        },
        { method: 'post', replace: true }
      );
    },
    [submit, course]
  );
  const moveAccordionItemCompleted = useCallback(
    (indexQ: number, index: number, id: number, itemIndex: number) => {
      const getLessons = course.content[indexQ].lessons;
      const lessons = Object.assign(
        update(getLessons, {
          $splice: [
            [itemIndex, 1],
            [index, 0, getLessons[itemIndex]],
          ],
        })
      );
      submit(
        {
          action: 'accordionItem',
          indexQ: indexQ.toString(),
          lessons: JSON.stringify(lessons),
        },
        { method: 'post', replace: true }
      );
    },
    [submit, course]
  );
  return (
    <>
      <Outlet />
      <DndProvider backend={HTML5Backend}>
        <div className="flex flex-col ">
          {items.content &&
            items.content.map((section, indexQ) => (
              <DivAccordionDND
                key={section.id}
                index={indexQ}
                moveAccordion={moveAccordion}
                moveAccordionCompleted={moveAccordionCompleted}
              >
                <Accordion className="grow" multiple offsetIcon={false}>
                  <AccordionItem
                    className={`${dark ? 'bg-zinc-800' : 'bg-zinc-100'}`}
                    label={
                      <div className="flex items-center justify-between ">
                        <Text size="lg">{section.sectionTitle}</Text>
                        <Text className="">{sumTime(section)}</Text>
                      </div>
                    }
                  >
                    {section.lessons.map((lesson, indexA) => (
                      <DivAccordionItemDND
                        key={lesson.id}
                        id={lesson.id}
                        index={indexA}
                        indexQ={indexQ}
                        moveAccordionItem={moveAccordionItem}
                        moveAccordionItemCompleted={moveAccordionItemCompleted}
                      >
                        <CourseLessonList lesson={lesson} slug={course.slug} sectionId={section.id} />
                      </DivAccordionItemDND>
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
              </DivAccordionDND>
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
      </DndProvider>
    </>
  );
}

export default Content;
