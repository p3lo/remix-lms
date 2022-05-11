import { Accordion, AccordionItem, ActionIcon, Button, Text, useMantineColorScheme } from '@mantine/core';
import { Link, Outlet, useMatches, useSubmit } from '@remix-run/react';
import { RiAddCircleLine, RiDeleteBin6Line, RiEditBoxLine } from 'react-icons/ri';
import CourseLessonList from '~/components/CourseLessonList';
import { sumTime } from '~/utils/helpers';
import type { Course, CourseLessons } from '~/utils/types';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useCallback, useState } from 'react';
import update from 'immutability-helper';
import { DivAccordionDND } from '~/components/builder/DivAccordionDND';
import { DivAccordionItemDND } from '~/components/builder/DivAccordionItemDND';
import type { ActionFunction } from '@remix-run/node';
import invariant from 'tiny-invariant';

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const action = formData.get('action') as string;
  const indexContent = formData.get('indexQ');
  const indexPosition = formData.get('index');
  const lessonId = formData.get('id');
  const getLessons = formData.get('lessons');
  invariant(indexContent, 'index content is required');
  invariant(indexPosition, 'index position is required');
  invariant(lessonId, 'lesson id is required');
  invariant(action, 'action is required');
  if (action === 'accordionItem') {
    invariant(getLessons, 'lessons is required');
    const lessons = JSON.parse(getLessons.toString()) as CourseLessons[];
    let position = 0;
    let newLessons: CourseLessons[] = [];
    lessons.map((lesson: CourseLessons) => {
      console.log('lesson', lesson);
      console.log('position', position);
      console.log('indexPosition', indexPosition);
      console.log('lessonid', lessonId);
      if (position === +indexPosition) {
        const lessonIndex = lessons.findIndex((lessonItem: CourseLessons) => lessonItem.id === +lessonId);
        const lessonPush = Object.assign(lessons[lessonIndex]);
        newLessons.push(update(lessonPush, { position: { $set: position } }));
        position++;
      }
      if (lesson.id === +lessonId) {
        if (position !== +indexPosition) {
          return null;
        }
      }
      newLessons.push(update(lesson, { position: { $set: position } }));
      position++;
    });
    console.log(newLessons);

    // console.log(indexContent, indexPosition, lessonId, lessons);
  }
  return null;
};

function Content() {
  const { course } = useMatches()[2].data as { course: Course };
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
  const submit = useSubmit();
  const [items, setItems] = useState(course);
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
  const moveAccordionCompleted = useCallback((indexQ: number, index: number, id: number) => {
    submit(
      { indexQ: indexQ.toString(), index: index.toString(), id: id.toString() },
      { method: 'post', replace: true }
    );
  }, []);
  const moveAccordionItemCompleted = useCallback((indexQ: number, index: number, id: number) => {
    submit(
      {
        action: 'accordionItem',
        indexQ: indexQ.toString(),
        index: index.toString(),
        id: id.toString(),
        lessons: JSON.stringify(items.content[indexQ].lessons),
      },
      { method: 'post', replace: true }
    );
  }, []);
  return (
    <>
      <Outlet />
      <DndProvider backend={HTML5Backend}>
        <div className="flex flex-col ">
          {items.content &&
            items.content.map((section, indexQ) => (
              <DivAccordionDND key={section.id} index={indexQ} moveAccordion={moveAccordion}>
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
