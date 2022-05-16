import {
  Accordion,
  AccordionItem,
  ActionIcon,
  Anchor,
  Avatar,
  Divider,
  List,
  Text,
  Title,
  TypographyStylesProvider,
  useMantineColorScheme,
} from '@mantine/core';
import type { LoaderFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { RiCheckLine, RiFacebookFill, RiLinkedinFill, RiTumblrFill, RiTwitterFill } from 'react-icons/ri';
import CourseLessonList from '~/components/CourseLessonList';
import { prisma } from '~/utils/db.server';
import { secondsToTime, sumTime } from '~/utils/helpers';
import type { Course } from '~/utils/types';

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const slug = url.pathname.split('/')[2];
  if (!slug) {
    return redirect('/');
  }
  const course = await prisma.course.findUnique({
    where: {
      slug,
    },
    include: {
      author: {
        select: {
          name: true,
          picture: true,
          headline: true,
          bio: true,
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
            select: {
              id: true,
              lessonTitle: true,
              description: true,
              duration: true,
              type: true,
              preview: true,
            },
          },
        },
      },
    },
  });
  if (!course) {
    return redirect('/');
  }
  let sum_seconds = 0;
  let sum_lessons = 0;
  for (let section of course?.content) {
    for (let lesson of section.lessons) {
      sum_lessons += 1;
      if (lesson.duration) {
        sum_seconds += lesson.duration;
      }
    }
  }

  return json({ course, sum_seconds, sum_lessons });
};

function CourseItem() {
  const { course, sum_seconds, sum_lessons } = useLoaderData() as {
    course: Course;
    sum_seconds: number;
    sum_lessons: number;
  };
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  function getDate(date: string) {
    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    const d = new Date(date);
    // @ts-ignore
    return d.toLocaleDateString('en-UK', options);
  }
  return (
    <div className="grid grid-cols-3">
      <div className="col-span-2 flex flex-col space-y-5">
        <Title order={1}>{course.title}</Title>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Avatar src={course.author.picture} alt="author" radius="xl" size={25} />
            <Text size="sm" color="gray" className="opacity-50">
              by
            </Text>
            <Anchor component={Link} to={`/profile/${course.author.name}`} weight={700} size="sm" underline={false}>
              {course.author.name}
            </Anchor>
          </div>
          <div className="flex items-center">
            <Text size="sm" color="gray" className="opacity-50">
              Share:
            </Text>
            <ActionIcon className="opacity-50 hover:opacity-100">
              <RiFacebookFill />
            </ActionIcon>
            <ActionIcon className="opacity-50 hover:opacity-100">
              <RiTwitterFill />
            </ActionIcon>
            <ActionIcon className="opacity-50 hover:opacity-100">
              <RiLinkedinFill />
            </ActionIcon>
            <ActionIcon className="opacity-50 hover:opacity-100">
              <RiTumblrFill />
            </ActionIcon>
          </div>
        </div>
        <Divider />
        <div className="grid grid-cols-4">
          <div className="flex flex-col items-start">
            <Text size="sm" color="gray" className="opacity-50">
              Category
            </Text>
            <Anchor
              component={Link}
              to={`/category/${course.subCategory.name}`}
              weight={300}
              size="sm"
              underline={false}
            >
              {course.subCategory.name}
            </Anchor>
          </div>
          <div className="flex flex-col items-center">
            <Text size="sm" color="gray" className="opacity-50">
              Duration
            </Text>
            <Text size="sm">02:10</Text>
          </div>
          <div className="flex flex-col items-center">
            <Text size="sm" color="gray" className="opacity-50">
              Total Enrolled
            </Text>
            <Text size="sm">0</Text>
          </div>
          <div className="flex flex-col items-end">
            <Text size="sm" color="gray" className="opacity-50">
              Last Update
            </Text>
            <Text size="sm">{getDate(course.updatedAt)}</Text>
          </div>
        </div>
        <Divider />
        <div className="flex flex-col space-y-2">
          <Text size="xl" color="gray">
            About course
          </Text>
          <Text size="sm">{course.brief}</Text>
        </div>
        <div className="flex flex-col space-y-2">
          <Text size="xl" color="gray">
            Description
          </Text>
          <TypographyStylesProvider>
            <div className="text-sm" dangerouslySetInnerHTML={{ __html: course.description }} />
          </TypographyStylesProvider>
        </div>
        <div className="flex flex-col space-y-2">
          <Text size="xl" color="gray">
            What Will You Learn?
          </Text>

          <div className="grid grid-cols-2 text-sm space-y-0">
            {course.whatYouLearn.map((item) => (
              <List.Item icon={<RiCheckLine size={16} className="text-blue-600" />} key={item.id}>
                {item.whatYoullLearn}
              </List.Item>
            ))}
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <Text size="xl" color="gray">
              Topics for this course
            </Text>
            <div className="flex items-center space-x-5">
              <Text size="sm" color="gray">
                {sum_lessons} Lessons
              </Text>
              <Text size="sm" color="gray">
                {secondsToTime(sum_seconds, true)}
              </Text>
            </div>
          </div>
          <div className="flex flex-col">
            {course.content.map((section) => (
              <Accordion key={section.id} className="grow" multiple offsetIcon={false}>
                <AccordionItem
                  className={`${dark ? 'bg-zinc-800' : 'bg-zinc-100'}`}
                  label={
                    <div className="flex items-center justify-between ">
                      <Text size="lg">{section.sectionTitle}</Text>
                      <div className="flex items-center space-x-5">
                        {/* @ts-ignore */}
                        <Text>{section._count.lessons} Lessons</Text>
                        <Text className="">{sumTime(section, true)}</Text>
                      </div>
                    </div>
                  }
                >
                  {section.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className={`flex grow rounded flex-col mb-[1px] p-1 ${dark ? 'bg-zinc-700' : 'bg-zinc-50'}`}
                    >
                      <CourseLessonList lesson={lesson} slug={course.slug} sectionId={section.id} isBuilder={false} />
                    </div>
                  ))}
                </AccordionItem>
              </Accordion>
            ))}
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <Text size="xl" color="gray">
            About the instructor
          </Text>
          <div className={`p-3 border-[0.5px] ${dark ? 'border-gray-700' : 'border-gray-300'}`}>
            <div className="flex space-x-4 items-start">
              <div className="flex space-x-2 items-center w-[500px]">
                <Avatar src={course.author.picture} alt="author" radius="xl" size={45} />
                <div className="flex flex-col">
                  <Anchor
                    component={Link}
                    to={`/profile/${course.author.name}`}
                    weight={700}
                    size="sm"
                    underline={false}
                  >
                    {course.author.name}
                  </Anchor>
                  <Text size="xs" color="gray" className="opacity-70 ">
                    {course.author.headline}
                  </Text>
                </div>
              </div>

              <TypographyStylesProvider>
                <div className="text-sm" dangerouslySetInnerHTML={{ __html: course.author.bio }} />
              </TypographyStylesProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseItem;
