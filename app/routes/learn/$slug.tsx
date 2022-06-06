import {
  Accordion,
  AccordionItem,
  Loader,
  LoadingOverlay,
  Paper,
  ScrollArea,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import type { LoaderFunction } from '@remix-run/node';
import { redirect, json } from '@remix-run/node';
import { Outlet, useLoaderData, useSearchParams, useSubmit, useTransition } from '@remix-run/react';
import CourseLessonLearn from '~/components/learn/CourseLessonLearn';

import LearningLayout from '~/components/layouts/learning-layout/LearningLayout';
import { prisma } from '~/utils/db.server';
import { sumTime } from '~/utils/helpers';
import type { Course } from '~/utils/types';
import { supabaseStrategy } from '~/utils/auth.server';
import { RiSkipBackLine, RiSkipForwardLine } from 'react-icons/ri';
import TabInfoNavigation from '~/components/learn/TabInfoNavigation';

export const loader: LoaderFunction = async ({ params, request }) => {
  const session = await supabaseStrategy.checkSession(request);
  if (!session) {
    return redirect('/');
  }
  // const progressDb = prisma.course_progress.findMany({
  //   where: {
  //     AND: [
  //       {
  //         lesson: {
  //           section: {
  //             course: {
  //               slug: params.slug,
  //             },
  //           },
  //         },
  //       },
  //       {
  //         user: {
  //           email: session?.user?.email,
  //         },
  //       },
  //     ],
  //   },
  //   include: {
  //     lesson: {
  //       select: {
  //         sectionId: true,
  //       },
  //     },
  //   },
  // });
  const course = await prisma.course.findUnique({
    where: {
      slug: params.slug,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          picture: true,
          headline: true,
          bio: true,
        },
      },
      content: {
        orderBy: { position: 'asc' },
        include: {
          _count: {
            select: {
              lessons: true,
            },
          },
          lessons: {
            orderBy: { position: 'asc' },
            select: {
              id: true,
              lessonTitle: true,
              duration: true,
              type: true,
              course_progress: {
                select: {
                  isCompleted: true,
                  endedHere: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!course) {
    return redirect('/');
  }
  let course_progress;
  const url = new URL(request.url);
  const lessonId = url.searchParams.get('id');
  for (const section of course?.content) {
    for (const lesson of section.lessons) {
      if (lesson.course_progress[0].endedHere) {
        course_progress = { section: section.id, lesson: lesson.id };
        break;
      }
    }
  }
  if (!course_progress) {
    course_progress = { section: 0, lesson: course.content[0].lessons[0].id };
  }
  if (!lessonId) {
    return redirect(`/learn/${params.slug}/lesson?id=${course_progress?.lesson}&tab=0`);
  }
  return json({ course, course_progress, lessonId });
};

function LearningSlug() {
  const { course, course_progress } = useLoaderData() as {
    course: Course;
    course_progress: { section: number; lesson: number };
  };
  const [searchParams] = useSearchParams();
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
  const transition = useTransition();
  const loader = transition.state === 'submitting' || transition.state === 'loading' ? true : false;
  const setEndedHere = useSubmit();

  function nextLesson() {
    const lessonId = searchParams.get('id');
    const tab = searchParams.get('tab');
    const secIndex = course.content.findIndex((section) => section.id === course_progress.section);
    const lessonIndex = course.content[secIndex].lessons.findIndex((lesson) => lesson.id === +lessonId!);
    if (lessonIndex < course.content[secIndex].lessons.length - 1) {
      setEndedHere(
        {
          action: 'updateMarked',
          userId: course.author.id.toString(),
          lessonId: course.content[secIndex].lessons[lessonIndex + 1].id.toString(),
          courseId: course.id.toString(),
        },
        {
          method: 'post',
          replace: true,
          action: `/learn/${course.slug}/lesson?id=${course.content[secIndex].lessons[lessonIndex + 1].id}&tab=${
            tab || 0
          }`,
        }
      );
    } else if (course.content[secIndex + 1]) {
      setEndedHere(
        {
          action: 'updateMarked',
          userId: course.author.id.toString(),
          lessonId: course.content[secIndex + 1].lessons[0].id.toString(),
          courseId: course.id.toString(),
        },
        {
          method: 'post',
          replace: true,
          action: `/learn/${course.slug}/lesson?id=${course.content[secIndex + 1].lessons[0].id}&tab=${tab || 0}`,
        }
      );
    } else {
      return;
    }
  }
  function prevLesson() {
    const lessonId = searchParams.get('id');
    const tab = searchParams.get('tab');
    const secIndex = course.content.findIndex((section) => section.id === course_progress.section);
    const lessonIndex = course.content[secIndex].lessons.findIndex((lesson) => lesson.id === +lessonId!);
    if (lessonIndex > 0) {
      setEndedHere(
        {
          action: 'updateMarked',
          userId: course.author.id.toString(),
          lessonId: course.content[secIndex].lessons[lessonIndex - 1].id.toString(),
          courseId: course.id.toString(),
        },
        {
          method: 'post',
          replace: true,
          action: `/learn/${course.slug}/lesson?id=${course.content[secIndex].lessons[lessonIndex - 1].id}&tab=${
            tab || 0
          }`,
        }
      );
    } else if (course.content[secIndex - 1]) {
      setEndedHere(
        {
          action: 'updateMarked',
          userId: course.author.id.toString(),
          lessonId: course.content[secIndex - 1].lessons[course.content[secIndex - 1].lessons.length - 1].id.toString(),
          courseId: course.id.toString(),
        },
        {
          method: 'post',
          replace: true,
          action: `/learn/${course.slug}/lesson?id=${
            course.content[secIndex - 1].lessons[course.content[secIndex - 1].lessons.length - 1].id
          }&tab=${tab || 0}`,
        }
      );
    } else {
      return;
    }
  }
  return (
    <LearningLayout>
      <div className="grid grid-cols-4 relative">
        <div className="col-span-3">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-full h-[80vh] relative">
              <div
                className="absolute top-[50%] left-0 right-0 bottom-0 z-50 w-8 h-8 p-1 border-2 cursor-pointer opacity-20 hover:opacity-100"
                onClick={prevLesson}
              >
                <RiSkipBackLine className="w-5 h-5" />
              </div>
              <div
                className="absolute top-[50%] left-[97,5%] right-0 bottom-0 z-50 w-8 h-8 p-1 border-2 cursor-pointer opacity-20 hover:opacity-100"
                onClick={nextLesson}
              >
                <RiSkipForwardLine className="w-5 h-5" />
              </div>
              <Outlet />
            </div>
            <div className="w-full">
              <TabInfoNavigation course={course} />
            </div>
          </div>
        </div>
        <div>
          <div className="sticky top-0">
            <ScrollArea style={{ height: '92vh' }}>
              <Paper withBorder className="flex flex-col">
                <Text p={10} size="md" weight={500}>
                  Course content
                </Text>
                {course.content.map((section, index) => (
                  <Accordion
                    key={section.id}
                    initialItem={course_progress.section === section.id ? index : 0}
                    className="relative grow "
                    multiple
                    offsetIcon={false}
                  >
                    <AccordionItem
                      className={`${dark ? 'bg-zinc-800' : 'bg-zinc-100'}`}
                      label={
                        <div className="flex flex-col items-start ">
                          <Text size="lg">
                            Section {index + 1}: {section.sectionTitle}
                          </Text>
                          <div className="flex items-center space-x-1">
                            {/* @ts-ignore */}
                            <Text size="xs">{section._count.lessons} Lessons</Text>
                            <div className="border-l h-[15px] opacity-50" />
                            <Text size="xs">{sumTime(section, true)}</Text>
                          </div>
                        </div>
                      }
                    >
                      <LoadingOverlay loader={<Loader variant="dots" />} visible={loader} />
                      {section.lessons.map((lesson, index) => (
                        <CourseLessonLearn
                          key={lesson.id}
                          lesson={lesson}
                          complete={lesson.course_progress[0]?.isCompleted || false}
                          numbered={index + 1}
                          userId={course.author.id}
                          slug={course.slug}
                          courseId={course.id}
                        />
                      ))}
                    </AccordionItem>
                  </Accordion>
                ))}
              </Paper>
            </ScrollArea>
          </div>
        </div>
      </div>
    </LearningLayout>
  );
}

export default LearningSlug;

export const unstable_shouldReload = () => false;
