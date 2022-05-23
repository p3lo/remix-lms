import { Checkbox, Text, UnstyledButton } from '@mantine/core';
import { Link, useSubmit } from '@remix-run/react';
import { useState } from 'react';
import { RiFileTextLine, RiQuestionnaireLine, RiVideoLine } from 'react-icons/ri';
import { secondsToTime } from '~/utils/helpers';
import type { CourseLessons } from '~/utils/types';

function CourseLessonLearn({
  lesson,
  complete,
  numbered,
  isMarked,
  userId,
}: {
  lesson: CourseLessons;
  complete: boolean;
  numbered: number;
  isMarked: boolean;
  userId: number;
}) {
  const setCompletedDb = useSubmit();
  const [completed, setCompleted] = useState(complete);
  const updateCompleted = () => {
    setCompleted((prev) => !prev);
    setCompletedDb(
      {
        userId: userId.toString(),
        lessonId: lesson.id.toString(),
        completed: completed.toString(),
      },
      { method: 'put', replace: true }
    );
  };

  return (
    <div className="flex space-x-1 items-center">
      <Checkbox className="top-5" checked={completed} onChange={updateCompleted} />
      <UnstyledButton
        component={Link}
        to={`lesson?id=${lesson.id}`}
        className={` px-2 grow cursor-pointer py-1 flex items-center space-x-4 hover:bg-gray-500 ${
          isMarked ? 'bg-gray-500' : ''
        }`}
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
