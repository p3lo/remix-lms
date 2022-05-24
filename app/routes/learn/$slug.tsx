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
import { Outlet, useLoaderData, useSearchParams, useTransition } from '@remix-run/react';
import CourseLessonLearn from '~/components/learn/CourseLessonLearn';

import LearningLayout from '~/components/layouts/learning-layout/LearningLayout';
import { prisma } from '~/utils/db.server';
import { sumTime } from '~/utils/helpers';
import type { Course } from '~/utils/types';
import { supabaseStrategy } from '~/utils/auth.server';

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
  const courseDb = prisma.course.findUnique({
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
          enrolled: {
            select: {
              courseId: true,
            },
          },
          _count: {
            select: {
              authored: true,
            },
          },
        },
      },
      whatYouLearn: true,
      subCategory: {
        select: {
          name: true,
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
            include: {
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

  const totalLessonsDb = prisma.course_content_lessons.count({
    where: {
      section: {
        course: {
          slug: params.slug,
        },
      },
    },
  });
  const completedLessonsDb = prisma.course_progress.count({
    where: {
      AND: [
        {
          lesson: {
            section: {
              course: {
                slug: params.slug,
              },
            },
          },
        },
        {
          isCompleted: true,
        },
      ],
    },
  });

  const [course, totalLessons, completedLessons] = await prisma.$transaction([
    courseDb,
    totalLessonsDb,
    completedLessonsDb,
  ]);

  if (!course) {
    return redirect('/');
  }
  const statistics = { totalLessons, completedLessons, percent: Math.round((completedLessons / totalLessons) * 100) };
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
    return redirect(`/learn/${params.slug}/lesson?id=${course_progress?.lesson}`);
  }
  return json({ course, course_progress, statistics, lessonId });
};

function LearningSlug() {
  const { course, course_progress } = useLoaderData() as {
    course: Course;
    course_progress: { section: number; lesson: number };
  };
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
  const [searchParams] = useSearchParams();
  const transition = useTransition();
  const loader = transition.state === 'submitting' || transition.state === 'loading' ? true : false;
  return (
    <LearningLayout>
      <div className="grid grid-cols-4">
        <div className="col-span-3">
          <div className="flex flex-col items-center">
            <div className="w-full h-[80vh]">
              <Outlet />
            </div>
            <div>Info</div>
          </div>
        </div>
        <ScrollArea style={{ height: '92vh' }}>
          <Paper withBorder className="flex flex-col">
            <Text p={10} size="md" weight={500}>
              Course content
            </Text>
            {course.content.map((section, index) => (
              <Accordion
                key={section.id}
                initialItem={course_progress.section === section.id ? index : 0}
                className="relative grow"
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
                      isMarked={+searchParams.get('id')! === lesson.id}
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
    </LearningLayout>
  );
}

export default LearningSlug;
