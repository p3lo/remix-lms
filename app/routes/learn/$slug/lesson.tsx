import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import LessonQuiz from '~/components/learn/LessonQuiz';
import LessonText from '~/components/learn/LessonText';
import LessonVideo from '~/components/learn/LessonVideo';
import { supabaseStrategy } from '~/utils/auth.server';
import { prisma } from '~/utils/db.server';
import { generateUUID } from '~/utils/helpers';
import type { CourseLessons } from '~/utils/types';

export const loader: LoaderFunction = async ({ request }) => {
  const session = await supabaseStrategy.checkSession(request);
  const url = new URL(request.url);
  const lessonId = url.searchParams.get('id');
  invariant(lessonId, 'lessonId is required');
  const lesson = await prisma.course_content_lessons.findFirst({
    where: {
      AND: [
        {
          id: +lessonId,
        },
        {
          section: {
            course: {
              author: {
                email: session?.user?.email,
              },
            },
          },
        },
      ],
    },
    include: {
      quiz: {
        include: {
          question: {
            orderBy: { position: 'asc' },
            include: {
              answer: true,
            },
          },
        },
      },
    },
  });
  if (!lesson) {
    return redirect('/user/enrolled-courses');
  }
  return json({ lesson });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const action = formData.get('action');
  invariant(action, 'action is required');
  if (action === 'updateComplete') {
    const lessonId = formData.get('lessonId');
    const userId = formData.get('userId');
    invariant(lessonId, 'lessonId is required');
    invariant(userId, 'userId is required');
    const getProgressId = await prisma.course_progress.findFirst({
      where: {
        AND: [
          {
            lessonId: +lessonId,
          },
          {
            userId: +userId,
          },
        ],
      },
      select: {
        id: true,
      },
    });
    const completed = formData.get('completed');
    invariant(completed, 'completed is required');
    await prisma.course_progress.upsert({
      where: {
        id: getProgressId?.id || 0,
      },
      update: {
        isCompleted: completed === 'false',
      },
      create: {
        isCompleted: completed === 'false',
        lessonId: +lessonId,
        userId: +userId,
      },
    });
  }
  if (action === 'updateMarked') {
    const lessonId = formData.get('lessonId');
    const userId = formData.get('userId');
    invariant(lessonId, 'lessonId is required');
    invariant(userId, 'userId is required');
    const getProgressId = await prisma.course_progress.findFirst({
      where: {
        AND: [
          {
            lessonId: +lessonId,
          },
          {
            userId: +userId,
          },
        ],
      },
      select: {
        id: true,
      },
    });
    const courseId = formData.get('courseId');
    invariant(courseId, 'courseId is required');
    await prisma.course_progress.updateMany({
      where: {
        AND: [
          {
            lesson: {
              section: {
                course: {
                  id: +courseId,
                },
              },
            },
          },
          {
            userId: +userId,
          },
          {
            endedHere: true,
          },
        ],
      },
      data: {
        endedHere: false,
      },
    });
    await prisma.course_progress.upsert({
      where: {
        id: getProgressId?.id || 0,
      },
      update: {
        endedHere: true,
      },
      create: {
        endedHere: true,
        lessonId: +lessonId,
        userId: +userId,
      },
    });
  }
  if (action === 'getTabInfo') {
    const whatToGet = formData.get('whatToGet');
    const courseId = formData.get('courseId');
    const userId = formData.get('userId');
    invariant(userId, 'userId is required');
    invariant(courseId, 'courseId is required');
    if (whatToGet === 'overview') {
      return null;
    }
    if (whatToGet === 'reviews') {
      const getReviews = await prisma.course_review.findMany({
        where: {
          courseId: +courseId,
        },
        include: {
          user: {
            select: {
              name: true,
              picture: true,
            },
          },
        },
      });
      const getAverage = await prisma.course_review.aggregate({
        where: {
          courseId: +courseId,
        },
        _avg: {
          rating: true,
        },
      });
      const getUserReview = await prisma.course_review.findFirst({
        where: {
          AND: [
            {
              courseId: +courseId,
            },
            {
              userId: +userId,
            },
          ],
        },
      });
      const getAllFiveStars = await prisma.course_review.count({
        where: {
          AND: [
            {
              courseId: +courseId,
            },
            {
              rating: {
                gte: 81,
              },
            },
            {
              rating: {
                lte: 100,
              },
            },
          ],
        },
      });
      const getAllFourStars = await prisma.course_review.count({
        where: {
          AND: [
            {
              courseId: +courseId,
            },
            {
              rating: {
                gte: 61,
              },
            },
            {
              rating: {
                lte: 80,
              },
            },
          ],
        },
      });
      const getAllThreeStars = await prisma.course_review.count({
        where: {
          AND: [
            {
              courseId: +courseId,
            },
            {
              rating: {
                gte: 41,
              },
            },
            {
              rating: {
                lte: 60,
              },
            },
          ],
        },
      });
      const getAllTwoStars = await prisma.course_review.count({
        where: {
          AND: [
            {
              courseId: +courseId,
            },
            {
              rating: {
                gte: 21,
              },
            },
            {
              rating: {
                lte: 40,
              },
            },
          ],
        },
      });
      const getAllOneStars = await prisma.course_review.count({
        where: {
          AND: [
            {
              courseId: +courseId,
            },
            {
              rating: {
                gte: 0,
              },
            },
            {
              rating: {
                lte: 20,
              },
            },
          ],
        },
      });
      const getAllStars = await prisma.course_review.count({
        where: {
          courseId: +courseId,
        },
      });
      return json({
        reviews: getReviews,
        average: getAverage,
        userReview: getUserReview,
        fiveStars: getAllFiveStars,
        fourStars: getAllFourStars,
        threeStars: getAllThreeStars,
        twoStars: getAllTwoStars,
        oneStars: getAllOneStars,
        allStars: getAllStars,
      });
    }
    if (whatToGet === 'announcements') {
      const getAnnouncements = await prisma.course_announcements.findMany({
        where: {
          courseId: +courseId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return json({
        announcements: getAnnouncements,
      });
    }
  }
  if (action === 'submitReview') {
    const rating = formData.get('rating');
    const comment = formData.get('comment');
    const courseId = formData.get('courseId');
    const userId = formData.get('userId');
    const userReviewId = formData.get('userReviewId') || 0;
    invariant(userId, 'userId is required');
    invariant(courseId, 'courseId is required');
    invariant(rating, 'rating is required');
    await prisma.course_review.upsert({
      where: {
        id: +userReviewId,
      },
      update: {
        rating: +rating,
        comment: comment?.toString() || '',
      },
      create: {
        rating: +rating,
        comment: comment?.toString() || '',
        courseId: +courseId,
        userId: +userId,
      },
    });
    return json({ success: generateUUID(5) });
  }
  if (action === 'submitAnnouncement') {
    const announcement = formData.get('rte');
    const courseId = formData.get('courseId');
    const userId = formData.get('userId');
    const title = formData.get('title');
    invariant(title, 'title is required');
    invariant(userId, 'userId is required');
    invariant(courseId, 'courseId is required');
    invariant(announcement, 'announcement is required');
    const announ = await prisma.course_announcements.create({
      data: {
        title: title?.toString() || '',
        announcement: announcement?.toString() || '',
        courseId: +courseId,
        userId: +userId,
      },
    });
    return json({ announ });
  }
  if (action === 'deleteAnnouncement') {
    const announcementId = formData.get('announcementId');
    invariant(announcementId, 'announcementId is required');
    await prisma.course_announcements.delete({
      where: {
        id: +announcementId,
      },
    });
    return json({ success: true });
  }
  if (action === 'updateAnnouncement') {
    const announcementId = formData.get('announcementId');
    const title = formData.get('title');
    const announcement = formData.get('rte');
    invariant(announcement, 'announcement is required');
    invariant(title, 'title is required');
    invariant(announcementId, 'announcementId is required');
    await prisma.course_announcements.update({
      where: {
        id: +announcementId,
      },
      data: {
        title: title?.toString() || '',
        announcement: announcement?.toString() || '',
      },
    });
    return json({ update: true });
  }

  return null;
};

function LearnLesson() {
  // @ts-ignore
  const { lesson } = useLoaderData() as CourseLessons;
  return (
    <>
      {lesson.type === 'video' && <LessonVideo url={lesson.video} />}
      {lesson.type === 'text' && <LessonText text={lesson.textContent} />}
      {lesson.type === 'quiz' && <LessonQuiz quiz={lesson.quiz} />}
    </>
  );
}

export default LearnLesson;
