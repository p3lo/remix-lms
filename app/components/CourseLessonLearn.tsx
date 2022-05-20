import { Checkbox, Text } from '@mantine/core';
import { RiFileTextLine, RiQuestionnaireLine, RiVideoLine } from 'react-icons/ri';
import { secondsToTime } from '~/utils/helpers';
import type { CourseLessons } from '~/utils/types';

function CourseLessonLearn({
  lesson,
  complete,
  numbered,
  isMarked,
}: {
  lesson: CourseLessons;
  complete: boolean;
  numbered: number;
  isMarked: boolean;
}) {
  return (
    <div
      className={`px-2 cursor-pointer py-1 flex items-center space-x-4 hover:bg-gray-500 ${
        isMarked ? 'bg-gray-500' : ''
      }`}
    >
      <Checkbox className="top-5" defaultChecked={complete} />
      <div className="flex flex-col">
        <Text>
          {numbered}. {lesson.lessonTitle}
        </Text>
        <div className="flex space-x-1 opacity-50 items-center">
          {lesson.type === 'video' && <RiVideoLine size={17} />}
          {lesson.type === 'text' && <RiFileTextLine size={17} />}
          {lesson.type === 'quiz' && <RiQuestionnaireLine size={17} />}
          <Text className="" size="xs">
            {secondsToTime(lesson.duration, true)}
          </Text>
        </div>
      </div>
    </div>
  );
}

export default CourseLessonLearn;
