import { Checkbox, createStyles, Text, UnstyledButton } from '@mantine/core';
import { Link, useSearchParams, useSubmit } from '@remix-run/react';
import { useState } from 'react';
import { RiFileTextLine, RiQuestionnaireLine, RiVideoLine } from 'react-icons/ri';
import { secondsToTime } from '~/utils/helpers';
import type { CourseLessons } from '~/utils/types';

const useStyles = createStyles((theme) => ({
  button: {
    display: 'block',
    width: '100%',
    padding: theme.spacing.xs,
    borderRadius: theme.radius.sm,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3],
    },
  },

  active: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3],
  },
}));

function CourseLessonLearn({
  lesson,
  complete,
  numbered,
  userId,
  slug,
  courseId,
}: {
  lesson: CourseLessons;
  complete: boolean;
  numbered: number;
  userId: number;
  slug: string;
  courseId: number;
}) {
  const [searchParams] = useSearchParams();
  const setCompletedDb = useSubmit();
  const setMarked = useSubmit();
  const [completed, setCompleted] = useState(complete);
  const { classes, cx } = useStyles();
  const updateCompleted = () => {
    setCompleted((prev) => !prev);
    setCompletedDb(
      {
        action: 'updateComplete',
        userId: userId.toString(),
        lessonId: lesson.id.toString(),
        completed: completed.toString(),
      },
      { method: 'post', replace: true, action: `/learn/${slug}/lesson?id=${+searchParams.get('id')!}` }
    );
  };
  const updateMarked = () => {
    setMarked(
      {
        action: 'updateMarked',
        userId: userId.toString(),
        lessonId: lesson.id.toString(),
        courseId: courseId.toString(),
      },
      { method: 'post', replace: true, action: `/learn/${slug}/lesson?id=${lesson.id}` }
    );
  };

  return (
    <div className="flex items-center space-x-1">
      <Checkbox className="top-5" checked={completed} onChange={updateCompleted} />
      <UnstyledButton
        component={Link}
        to={`lesson?id=${lesson.id}`}
        className={cx(classes.button, { [classes.active]: +searchParams.get('id')! === lesson.id })}
        onClick={updateMarked}
        // prefetch="intent"
      >
        <div className="flex flex-col">
          <Text>
            {numbered}. {lesson.lessonTitle}
          </Text>
          <div className="flex items-center space-x-1 opacity-50">
            {lesson.type === 'video' && <RiVideoLine size={17} />}
            {lesson.type === 'text' && <RiFileTextLine size={17} />}
            {lesson.type === 'quiz' && <RiQuestionnaireLine size={17} />}
            <Text className="" size="xs">
              {secondsToTime(lesson.duration, true)}
            </Text>
          </div>
        </div>
      </UnstyledButton>
    </div>
  );
}

export default CourseLessonLearn;
