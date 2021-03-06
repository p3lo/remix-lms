import { ActionIcon, Anchor, Collapse, Text } from '@mantine/core';
import { Link } from '@remix-run/react';
import { useState } from 'react';
import { CgChevronDownO, CgChevronUpO } from 'react-icons/cg';
import { RiDeleteBin6Line, RiEditBoxLine, RiVideoLine, RiFileTextLine, RiQuestionnaireLine } from 'react-icons/ri';
import { secondsToTime } from '~/utils/helpers';
import type { CourseLessons } from '~/utils/types';

function CourseLessonList({
  lesson,
  slug,
  sectionId,
  isBuilder = false,
}: {
  lesson: CourseLessons;
  slug: string;
  sectionId: number;
  isBuilder: boolean;
}) {
  const [opened, setOpen] = useState(false);
  return (
    <div className="flex items-center">
      <div className="flex items-center justify-between grow">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2" onClick={() => setOpen((o) => !o)}>
            {lesson.type === 'video' && <RiVideoLine size={17} />}
            {lesson.type === 'text' && <RiFileTextLine size={17} />}
            {lesson.type === 'quiz' && <RiQuestionnaireLine size={17} />}
            {lesson.description ? (
              <>
                <Text className="cursor-pointer">{lesson.lessonTitle}</Text>
                {opened ? (
                  <CgChevronUpO className="cursor-pointer" size={17} />
                ) : (
                  <CgChevronDownO className="cursor-pointer" size={17} />
                )}
              </>
            ) : (
              <Text className="">{lesson.lessonTitle}</Text>
            )}
          </div>
          <Collapse in={opened}>
            <Text size="sm">{lesson.description}</Text>
          </Collapse>
        </div>
        <div className="flex items-center mr-2 space-x-5">
          {isBuilder && (
            <>
              {lesson.type === 'video' && (
                <Anchor
                  component={Link}
                  to={`/course-builder/${slug}/content/preview-video?sectionId=${sectionId}&lessonId=${lesson.id}`}
                  size="xs"
                  className="text-sm"
                >
                  Preview
                </Anchor>
              )}
              {lesson.type === 'text' && (
                <Anchor
                  component={Link}
                  to={`/course-builder/${slug}/content/preview-text?sectionId=${sectionId}&lessonId=${lesson.id}`}
                  size="xs"
                  className="text-sm"
                >
                  Preview
                </Anchor>
              )}
              {lesson.type === 'quiz' && (
                <Anchor
                  component={Link}
                  to={`/course-builder/${slug}/content/preview-quiz?sectionId=${sectionId}&lessonId=${lesson.id}`}
                  size="xs"
                  className="text-sm"
                >
                  Preview
                </Anchor>
              )}
            </>
          )}
          {!isBuilder && lesson.preview && (
            <>
              {lesson.type === 'video' && (
                <Anchor
                  component={Link}
                  to={`/course/${slug}/preview-video?lessonId=${lesson.id}`}
                  size="xs"
                  className="text-sm"
                >
                  Preview
                </Anchor>
              )}
              {lesson.type === 'text' && (
                <Anchor
                  component={Link}
                  to={`/course/${slug}/preview-text?lessonId=${lesson.id}`}
                  size="xs"
                  className="text-sm"
                >
                  Preview
                </Anchor>
              )}
              {lesson.type === 'quiz' && (
                <Anchor
                  component={Link}
                  to={`/course/${slug}/preview-quiz?lessonId=${lesson.id}`}
                  size="xs"
                  className="text-sm"
                >
                  Preview
                </Anchor>
              )}
            </>
          )}
          <Text size="sm">{secondsToTime(lesson.duration || 0)}</Text>
        </div>
      </div>

      {isBuilder && (
        <>
          {lesson.type === 'video' && (
            <ActionIcon
              component={Link}
              to={`/course-builder/${slug}/content/edit-video-lesson?sectionId=${sectionId}&lessonId=${lesson.id}`}
            >
              <RiEditBoxLine color="cyan" size={15} />
            </ActionIcon>
          )}
          {lesson.type === 'text' && (
            <ActionIcon
              component={Link}
              to={`/course-builder/${slug}/content/edit-text-lesson?sectionId=${sectionId}&lessonId=${lesson.id}`}
            >
              <RiEditBoxLine color="cyan" size={15} />
            </ActionIcon>
          )}
          {lesson.type === 'quiz' && (
            <ActionIcon
              component={Link}
              to={`/course-builder/${slug}/content/edit-quiz-lesson?sectionId=${sectionId}&lessonId=${lesson.id}`}
            >
              <RiEditBoxLine color="cyan" size={15} />
            </ActionIcon>
          )}
          <ActionIcon
            component={Link}
            to={`/course-builder/${slug}/content/delete-lesson?sectionId=${sectionId}&lessonId=${lesson.id}`}
          >
            <RiDeleteBin6Line color="red" size={15} />
          </ActionIcon>
        </>
      )}
    </div>
  );
}

export default CourseLessonList;
