import { Button, Collapse, Progress, Text, Textarea, Title } from '@mantine/core';
import { Form, useFetcher, useSearchParams } from '@remix-run/react';
import React from 'react';
import { RiStarLine } from 'react-icons/ri';
import { Rating } from 'react-simple-star-rating';
import type { Course, CourseReviews } from '~/utils/types';

function Reviews({ course }: { course: Course }) {
  const fetcher = useFetcher();
  const reviews = fetcher.data?.reviews as CourseReviews[] | undefined;
  const average = fetcher.data?.average._avg.rating as number | null | undefined;
  const [reviewOpened, setReviewOpened] = React.useState(false);
  let [params] = useSearchParams();
  React.useEffect(() => {
    fetcher.submit(
      { whatToGet: 'reviews', courseId: course.id.toString(), action: 'getTabInfo' },
      { method: 'post', action: `/learn/${course.slug}/lesson` }
    );
  }, []);
  const getPercentStars = (rating: number) => {
    return (rating / 5) * 100;
  };
  return (
    <div className="flex flex-col space-y-4 p-5">
      <div className="flex flex-col space-y-2">
        <Title order={2}>Student feedback</Title>
        <div className="flex space-x-5 items-center">
          <div className="flex flex-col items-center">
            <Title className="text-7xl">{average ? average : '0.0'}</Title>
            <Rating ratingValue={average ? getPercentStars(average) : getPercentStars(0.0)} size={20} readonly />
            <Text>Course Rating</Text>
          </div>
          <div className="flex flex-col grow">
            <div className="flex space-x-5 items-center">
              <Progress className="grow" size="sm" radius="xs" value={50} />
              <Rating ratingValue={80} size={15} readonly />
            </div>
            <div className="flex space-x-5 items-center">
              <Progress className="grow" size="sm" radius="xs" value={50} />
              <Rating ratingValue={60} size={15} readonly />
            </div>
            <div className="flex space-x-5 items-center">
              <Progress className="grow" size="sm" radius="xs" value={50} />
              <Rating ratingValue={40} size={15} readonly />
            </div>
            <div className="flex space-x-5 items-center">
              <Progress className="grow" size="sm" radius="xs" value={50} />
              <Rating ratingValue={20} size={15} readonly />
            </div>
            <div className="flex space-x-5 items-center">
              <Progress className="grow" size="sm" radius="xs" value={50} />
              <Rating ratingValue={0} size={15} readonly />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-3">
        <Button
          onClick={() => setReviewOpened((o) => !o)}
          leftIcon={<RiStarLine />}
          variant="subtle"
          className="w-[200px]"
        >
          Leave a rating
        </Button>
        <Collapse in={reviewOpened}>
          <Form
            method="post"
            action={`/learn/${course.slug}/lesson?id=${+params.get('id')!}&tab=${+params.get('tab')!}`}
          >
            <Rating ratingValue={50} size={35} allowHalfIcon />
            <input hidden name="action" value="submitReview" />
            <Textarea placeholder="Your review (optional)" label="Your review" />
            <Button type="submit" mt={15}>
              Submit
            </Button>
          </Form>
        </Collapse>
      </div>
    </div>
  );
}

export default Reviews;
