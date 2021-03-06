import {
  Avatar,
  Button,
  Collapse,
  Divider,
  Loader,
  LoadingOverlay,
  Progress,
  Text,
  Textarea,
  Title,
} from '@mantine/core';
import { Form, useFetcher, useMatches, useSearchParams } from '@remix-run/react';
import * as React from 'react';
import { RiStarLine } from 'react-icons/ri';
import { Rating } from 'react-simple-star-rating';
import type { Course, CourseReviews } from '~/utils/types';
import TimeAgo from 'react-timeago';

function Reviews({ course }: { course: Course }) {
  const fetcher = useFetcher();
  const reviewFetcher = useFetcher();
  const getData = useMatches()[0];
  const userId = getData?.data.profile.id;
  const [reviews, setReviews] = React.useState<CourseReviews[]>([]);
  const [average, setAverage] = React.useState<number | undefined>();
  const [rating, setRating] = React.useState<number>(50);
  const [userReview, setUserReview] = React.useState<CourseReviews | undefined>();
  const [reviewOpened, setReviewOpened] = React.useState(false);
  const [fiveStar, setFiveStar] = React.useState<number>(0);
  const [fourStar, setFourStar] = React.useState<number>(0);
  const [threeStar, setThreeStar] = React.useState<number>(0);
  const [twoStar, setTwoStar] = React.useState<number>(0);
  const [oneStar, setOneStar] = React.useState<number>(0);
  const [reviewCount, setReviewCount] = React.useState<number>(0);
  const loader = fetcher.state === 'submitting' || fetcher.state === 'loading' ? true : false;

  let [params] = useSearchParams();
  React.useEffect(() => {
    fetcher.submit(
      { whatToGet: 'reviews', courseId: course.id.toString(), userId: userId.toString(), action: 'getTabInfo' },
      { method: 'post', action: `/learn/${course.slug}/lesson` }
    );
  }, [, reviewFetcher?.data]);
  React.useEffect(() => {
    if (reviewFetcher?.data) {
      setReviews(reviews.filter((r) => r.userId !== userId));
    }

    setReviews((prev) => [...(prev || []), ...(fetcher.data?.reviews || [])]);
  }, [fetcher.data?.reviews]);
  React.useEffect(() => {
    setAverage(fetcher.data?.average._avg.rating);
    setFiveStar(fetcher.data?.fiveStars);
    setFourStar(fetcher.data?.fourStars);
    setThreeStar(fetcher.data?.threeStars);
    setTwoStar(fetcher.data?.twoStars);
    setOneStar(fetcher.data?.oneStars);
    setReviewCount(fetcher.data?.allStars);
  }, [fetcher.data?.average]);
  React.useEffect(() => {
    setUserReview(fetcher.data?.userReview);
  }, [fetcher.data?.userReview]);

  const getRating = (percentage: number) => {
    return (Math.floor(percentage / 2) / 10).toFixed(1);
  };

  const getPercentage = (starsNo: number) => {
    if (reviewCount === 0) {
      return 0;
    } else {
      return (starsNo / reviewCount) * 100;
    }
  };

  return (
    <div className="flex flex-col p-5 space-y-4 relative">
      <LoadingOverlay loader={<Loader variant="dots" />} visible={loader} />
      <div className="flex flex-col space-y-2">
        <Title order={2}>Student feedback</Title>
        <div className="flex items-center px-5 space-x-5">
          <div className="flex flex-col items-center ">
            <Title className="text-7xl">{average ? getRating(average) : '0.0'}</Title>
            <Rating ratingValue={average ? average : 0} size={20} readonly />
            <Text>Course Rating</Text>
          </div>
          <div className="flex flex-col grow">
            <div className="flex items-center space-x-5">
              <Progress className="grow" size="sm" radius="xs" value={getPercentage(fiveStar)} />
              <Rating ratingValue={100} size={15} readonly />
            </div>
            <div className="flex items-center space-x-5">
              <Progress className="grow" size="sm" radius="xs" value={getPercentage(fourStar)} />
              <Rating ratingValue={80} size={15} readonly />
            </div>
            <div className="flex items-center space-x-5">
              <Progress className="grow" size="sm" radius="xs" value={getPercentage(threeStar)} />
              <Rating ratingValue={60} size={15} readonly />
            </div>
            <div className="flex items-center space-x-5">
              <Progress className="grow" size="sm" radius="xs" value={getPercentage(twoStar)} />
              <Rating ratingValue={40} size={15} readonly />
            </div>
            <div className="flex items-center space-x-5">
              <Progress className="grow" size="sm" radius="xs" value={getPercentage(oneStar)} />
              <Rating ratingValue={20} size={15} readonly />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col px-5 space-y-3">
        <Button
          onClick={() => setReviewOpened((o) => !o)}
          leftIcon={<RiStarLine />}
          variant="subtle"
          className="w-[200px]"
        >
          Leave a rating
        </Button>
        <Collapse in={reviewOpened}>
          <reviewFetcher.Form
            method="post"
            action={`/learn/${course.slug}/lesson?id=${+params.get('id')!}&tab=${+params.get('tab')!}`}
          >
            <Rating ratingValue={userReview?.rating || 50} size={35} allowHalfIcon onClick={(e) => setRating(e)} />
            <input hidden name="action" value="submitReview" readOnly />
            <input hidden name="rating" value={rating} readOnly />
            <input hidden name="courseId" value={course.id} readOnly />
            <input hidden name="userId" value={userId} readOnly />
            {userReview && <input hidden name="userReviewId" value={userReview.id} readOnly />}
            <Textarea
              placeholder="Your review (optional)"
              name="comment"
              label="Your review"
              defaultValue={userReview?.comment}
            />
            <Button type="submit" mt={15}>
              {userReview ? 'Update' : 'Submit'}
            </Button>
          </reviewFetcher.Form>
        </Collapse>
      </div>
      <div className="flex flex-col space-y-5">
        <Title order={2}>Reviews</Title>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div className="flex flex-col px-5 space-y-3" key={review.id}>
              <div className="flex space-x-4">
                <Avatar radius="xl" src={review.user.picture} />
                <div className="flex flex-col">
                  <Text weight={700}>{review.user.name}</Text>
                  <div className="flex items-start space-x-3">
                    <Rating ratingValue={review.rating} size={20} allowHalfIcon readonly />
                    <TimeAgo className="text-sm" date={review.createdAt} />
                  </div>
                  <Text size="sm">{review.comment}</Text>
                </div>
              </div>
              <Divider />
            </div>
          ))
        ) : (
          <Text>No reviews yet</Text>
        )}
      </div>
    </div>
  );
}

export default Reviews;
