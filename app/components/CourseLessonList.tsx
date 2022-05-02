import { ActionIcon, Anchor, Collapse, Text } from '@mantine/core';
import { Link } from '@remix-run/react';
import { useState } from 'react';
import { CgChevronDownO, CgChevronUpO } from 'react-icons/cg';
import { RiDeleteBin6Line, RiEditBoxLine, RiVideoLine } from 'react-icons/ri';
import { secondsToTime } from '~/utils/helpers';
import type { CourseLessons } from '~/utils/types';

function CourseLessonList({ lesson, slug, sectionId }: { lesson: CourseLessons; slug: string; sectionId: number }) {
  const [opened, setOpen] = useState(false);
  return (
    <div className="flex items-center">
      <div className="flex items-center justify-between grow">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2" onClick={() => setOpen((o) => !o)}>
            {lesson.type === 'video' && <RiVideoLine size={17} />}
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
          {lesson.type === 'video' && (
            <Anchor component={Link} to="" size="xs" className="text-sm">
              Preview
            </Anchor>
          )}
          <Text size="sm">{secondsToTime(lesson.duration || 0)}</Text>
        </div>
      </div>
      <ActionIcon
        component={Link}
        to={`/course-builder/${slug}/content/edit-video-lesson?sectionId=${sectionId}&lessonId=${lesson.id}`}
      >
        <RiEditBoxLine color="cyan" size={15} />
      </ActionIcon>
      <ActionIcon
        component={Link}
        to={`/course-builder/${slug}/content/delete-video-lesson?sectionId=${sectionId}&lessonId=${lesson.id}`}
      >
        <RiDeleteBin6Line color="red" size={15} />
      </ActionIcon>
    </div>
  );
}

export default CourseLessonList;
