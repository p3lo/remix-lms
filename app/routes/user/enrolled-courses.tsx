import { Image, Paper, RingProgress, Text } from '@mantine/core';
import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { Rating } from 'react-simple-star-rating';

import { supabaseStrategy } from '~/utils/auth.server';
import { prisma } from '~/utils/db.server';
import { getNiceDate } from '~/utils/helpers';
import type { Enrolled } from '~/utils/types';

interface EnrolledWTotal extends Enrolled {
  percentTotal: number;
  average: number;
  reviewsCount: number;
}

export const loader: LoaderFunction = async ({ request }) => {
  const session = await supabaseStrategy.checkSession(request);
  const courses = await prisma.enrolled_course.findMany({
    where: {
      user: {
        email: session?.user?.email,
      },
    },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          image: true,
          slug: true,
          author: {
            select: {
              name: true,
            },
          },
          updatedAt: true,
        },
      },
    },

    orderBy: {
      enrolledAt: 'desc',
    },
  });

  for await (const course of courses) {
    const getLessonsTotal = await prisma.course_content_lessons.count({
      where: {
        section: {
          course: {
            id: course.course.id,
          },
        },
      },
    });
    const getLessonsCompleted = await prisma.course_progress.count({
      where: {
        AND: [
          {
            lesson: {
              section: {
                course: {
                  id: course.course.id,
                },
              },
            },
          },
          {
            user: {
              email: session?.user?.email,
            },
          },
          {
            isCompleted: true,
          },
        ],
      },
    });
    const getAverage = await prisma.course_review.aggregate({
      where: {
        courseId: course.course.id,
      },
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    });
    const percentTotal = Math.round((getLessonsCompleted / getLessonsTotal) * 100);
    const getIndex = courses.findIndex((item) => item.course.id === course.course.id);
    Object.assign(courses[getIndex], {
      percentTotal,
      average: getAverage._avg.rating,
      reviewsCount: getAverage._count.rating,
    });
  }

  return json({ courses });
};

function OwnedCourses() {
  const { courses } = useLoaderData() as { courses: EnrolledWTotal[] };
  const getRating = (percentage: number) => {
    return (Math.floor(percentage / 2) / 10).toFixed(1);
  };
  return (
    <div className="max-w-4xl mx-auto">
      <Text className="flex justify-center p-3" size="xl" weight={700}>
        Enrolled Courses
      </Text>
      <div className="flex flex-col my-5 space-y-3">
        {courses.map((course) => (
          <Paper component={Link} to={`/learn/${course.course.slug}`} p="xs" key={course.id} withBorder>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-2">
                <Image height={100} width={160} src={course.course.image} />
                <div className="flex flex-col">
                  <Text lineClamp={2} size="sm" weight={700}>
                    {course.course.title}
                  </Text>
                  <Text size="xs" className="opacity-70">
                    Author: {course.course.author.name}
                  </Text>
                  <Text size="xs" className="opacity-50">
                    Enrolled: {getNiceDate(course.enrolledAt)}
                  </Text>
                  <Text size="xs" className="opacity-50">
                    Updated: {getNiceDate(course.course.updatedAt)}
                  </Text>
                  <div className="flex space-x-1 items-center">
                    <Text weight={600} size="xs">
                      {getRating(course.average)}
                    </Text>
                    <Rating ratingValue={course.average || 0} size={15} readonly />
                    <Text size="xs" className="opacity-50">
                      ({course.reviewsCount})
                    </Text>
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-1 w-[100px] items-center">
                <Text component={Link} size="xs" to={`/learn/${course.course.slug}`}>
                  Go to course
                </Text>
                <RingProgress
                  size={70}
                  thickness={7}
                  roundCaps
                  sections={[{ value: course.percentTotal, color: 'blue' }]}
                  label={
                    <Text color="blue" weight={700} align="center" size="sm">
                      {course.percentTotal || 0}%
                    </Text>
                  }
                />
              </div>
            </div>
          </Paper>
        ))}
      </div>
    </div>
  );
}

export default OwnedCourses;
