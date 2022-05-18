import {
  Accordion,
  AccordionItem,
  ActionIcon,
  Anchor,
  Avatar,
  Button,
  Divider,
  List,
  Spoiler,
  Text,
  Title,
  TypographyStylesProvider,
  useMantineColorScheme,
} from '@mantine/core';
import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, Link, Outlet, useLoaderData, useMatches, useTransition } from '@remix-run/react';
import {
  RiCheckLine,
  RiFacebookFill,
  RiLinkedinFill,
  RiTrophyLine,
  RiTumblrFill,
  RiTwitterFill,
  RiVideoLine,
} from 'react-icons/ri';
import { VscMortarBoard } from 'react-icons/vsc';
import { MdOutlinePlayLesson, MdOutlineMobileFriendly, MdOutlineShoppingCart } from 'react-icons/md';
import { IoInfiniteOutline } from 'react-icons/io5';
import ReactPlayer from 'react-player';
import CourseLessonList from '~/components/CourseLessonList';
import { prisma } from '~/utils/db.server';
import { getNiceDate, secondsToTime, sumTime } from '~/utils/helpers';
import type { Course, User } from '~/utils/types';
import invariant from 'tiny-invariant';
import { CgProfile } from 'react-icons/cg';

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
      enrolled: true,
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
  console.log(course?.author.enrolled);
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

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const courseId = formData.get('courseId');
  const profileId = formData.get('profileId');
  invariant(courseId, 'courseId is required');
  invariant(profileId, 'profileId is required');
  const alreadyEnrolled = await prisma.enrolled_course.findFirst({
    where: {
      AND: [
        {
          courseId: +courseId,
        },
        {
          userId: +profileId,
        },
      ],
    },
  });
  if (alreadyEnrolled) {
    return null;
  }
  const inCart = await prisma.cart.findFirst({
    where: {
      AND: [
        {
          courseId: +courseId,
        },
        {
          userId: +profileId,
        },
      ],
    },
  });
  if (inCart) {
    return null;
  }
  await prisma.cart.create({
    data: {
      courseId: +courseId,
      userId: +profileId,
    },
  });
  return null;
};

function CourseItem() {
  const { course, sum_seconds, sum_lessons } = useLoaderData() as {
    course: Course;
    sum_seconds: number;
    sum_lessons: number;
  };
  const { profile } = useMatches()[0].data as { profile: User };
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
  const transition = useTransition();
  const loader = transition.state === 'submitting' || transition.state === 'loading' ? true : false;

  function isFound(id: number) {
    return course.author.enrolled.some((e) => e.courseId === id);
  }
  return (
    <div className="grid max-w-6xl grid-cols-3 gap-10 mx-auto">
      <Outlet />
      <div className="flex flex-col col-span-2 space-y-5">
        {/* <div className="flex items-center space-x-2">
          <Text>Rating 5.00</Text>
          <Text className="opacity-50">(2)</Text>
        </div> */}
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
            <ActionIcon variant="transparent" className="opacity-50 hover:opacity-100 hover:text-blue-500">
              <RiFacebookFill />
            </ActionIcon>
            <ActionIcon variant="transparent" className="opacity-50 hover:opacity-100 hover:text-blue-500">
              <RiTwitterFill />
            </ActionIcon>
            <ActionIcon variant="transparent" className="opacity-50 hover:opacity-100 hover:text-blue-500">
              <RiLinkedinFill />
            </ActionIcon>
            <ActionIcon variant="transparent" className="opacity-50 hover:opacity-100 hover:text-blue-500">
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
            <Text size="sm">{secondsToTime(sum_seconds, true)}</Text>
          </div>
          <div className="flex flex-col items-center">
            <Text size="sm" color="gray" className="opacity-50">
              Total Enrolled
            </Text>
            <Text size="sm">{course.enrolled.length}</Text>
          </div>
          <div className="flex flex-col items-end">
            <Text size="sm" color="gray" className="opacity-50">
              Last Update
            </Text>
            <Text size="sm">{getNiceDate(course.updatedAt)}</Text>
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
          <Spoiler maxHeight={200} showLabel="Show more" hideLabel="Hide">
            <TypographyStylesProvider>
              <div className="text-sm" dangerouslySetInnerHTML={{ __html: course.description }} />
            </TypographyStylesProvider>
          </Spoiler>
        </div>
        <div className="flex flex-col space-y-2">
          <Text size="xl" color="gray">
            What Will You Learn?
          </Text>

          <div className="grid grid-cols-2 space-y-0 text-sm">
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
          <div className="flex flex-col">
            <div className={`p-3 border-[0.5px] ${dark ? 'border-gray-700' : 'border-gray-300'}`}>
              <div className="grid grid-cols-4 place-items-start">
                <div className="flex items-center space-x-2">
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
                <Spoiler className="col-span-3" maxHeight={100} showLabel="Show more" hideLabel="Hide">
                  <TypographyStylesProvider>
                    <div className="text-sm" dangerouslySetInnerHTML={{ __html: course.author.bio }} />
                  </TypographyStylesProvider>
                </Spoiler>
              </div>
            </div>
            <div
              className={`p-3 border-b-[0.5px] border-l-[0.5px] border-r-[0.5px] flex justify-between ${
                dark ? 'border-gray-700' : 'border-gray-300'
              }`}
            >
              <div></div>
              <div className="flex items-center space-x-1">
                <VscMortarBoard size={22} />
                {/* @ts-ignore */}
                <Text size="sm">{course.author._count.authored}</Text>
                <Text size="sm" className="opacity-50">
                  Courses
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="">
        <div className={`sticky top-10 border-[0.5px] ${dark ? 'border-gray-700' : 'border-gray-300'}`}>
          <div className="flex flex-col">
            <ReactPlayer
              config={{
                file: {
                  attributes: {
                    onContextMenu: (e: Event) => e.preventDefault(),
                    controlsList: 'nodownload',
                  },
                },
              }}
              light={course.image}
              controls
              width="100%"
              height={200}
              url={course.preview}
            />
            <div
              className={`flex flex-col p-4 space-y-3 border-t-[0.5px] ${dark ? 'border-gray-700' : 'border-gray-300'}`}
            >
              <Text size="xl" weight={700} color="gray">
                {course.price > 0 ? `$ ${course.price}.00` : 'Free'}
              </Text>
              <div className="flex flex-col space-y-1">
                <Text size="md" weight={500}>
                  This course includes:
                </Text>
                <div className="flex items-center space-x-2">
                  <RiVideoLine size={17} />
                  <Text size="sm" color="gray">
                    Over {secondsToTime(sum_seconds, true).split(' ')[0]} on-demand video
                  </Text>
                </div>
                <div className="flex items-center space-x-2">
                  <MdOutlinePlayLesson size={17} />
                  <Text size="sm" color="gray">
                    {sum_lessons} lessons
                  </Text>
                </div>
                <div className="flex items-center space-x-2">
                  <IoInfiniteOutline size={17} />
                  <Text size="sm" color="gray">
                    Full lifetime access
                  </Text>
                </div>
                <div className="flex items-center space-x-2">
                  <MdOutlineMobileFriendly size={17} />
                  <Text size="sm" color="gray">
                    Access on mobile and TV
                  </Text>
                </div>
                <div className="flex items-center space-x-2">
                  <RiTrophyLine size={17} />
                  <Text size="sm" color="gray">
                    Certificate of completion
                  </Text>
                </div>
              </div>
              {profile ? (
                <Form method="post" className="flex pt-5">
                  <input hidden readOnly value={course.id} name="courseId" />
                  <input hidden readOnly value={profile.id} name="profileId" />
                  {isFound(course.id) ? (
                    <Button
                      component={Link}
                      to={`/learn/${course.slug}`}
                      className="grow"
                      size="lg"
                      leftIcon={<VscMortarBoard size={24} />}
                      loading={loader}
                    >
                      Go to course
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="grow"
                      size="lg"
                      leftIcon={<MdOutlineShoppingCart size={24} />}
                      loading={loader}
                    >
                      Add to cart
                    </Button>
                  )}
                </Form>
              ) : (
                <Button className="grow" component={Link} to="/login" size="lg" leftIcon={<CgProfile size={24} />}>
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseItem;
