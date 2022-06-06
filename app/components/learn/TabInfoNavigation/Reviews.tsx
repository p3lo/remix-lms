import { useFetcher } from '@remix-run/react';
import React, { useEffect } from 'react';
import type { Course, CourseReviews } from '~/utils/types';

function Reviews({ course }: { course: Course }) {
  const fetcher = useFetcher();
  const reviews = fetcher.data as CourseReviews[] | undefined;
  useEffect(() => {
    fetcher.submit(
      { whatToGet: 'reviews', courseId: course.id.toString(), action: 'getTabInfo' },
      { method: 'post', action: `/learn/${course.slug}/lesson` }
    );
  }, [fetcher, course]);

  return <div>{JSON.stringify(reviews, null, 2)}</div>;
}

export default Reviews;
