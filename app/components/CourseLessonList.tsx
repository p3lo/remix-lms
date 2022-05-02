import { ActionIcon, Anchor, Collapse, Text } from '@mantine/core';
import { Link } from '@remix-run/react';
import { useState } from 'react';
import { CgChevronDownO, CgChevronUpO } from 'react-icons/cg';
import { RiDeleteBin6Line, RiEditBoxLine, RiVideoLine } from 'react-icons/ri';
import { secondsToTime } from '~/utils/helpers';

function CourseLessonList({
  lessonTitle,
  preview,
  description,
  type,
  duration,
  url,
}: {
  lessonTitle: string;
  preview: boolean;
  description: string;
  type: string;
  duration: number;
  url?: string;
}) {
  const [opened, setOpen] = useState(false);
  return (
    <div className="flex items-center">
      <div className="flex grow items-center justify-between">
        <div className="flex flex-col space-y-2">
          <div className="flex space-x-2 items-center" onClick={() => setOpen((o) => !o)}>
            {type === 'video' && <RiVideoLine size={17} />}
            {description ? (
              <>
                <Text className="cursor-pointer">{lessonTitle}</Text>
                {opened ? (
                  <CgChevronUpO className="cursor-pointer" size={17} />
                ) : (
                  <CgChevronDownO className="cursor-pointer" size={17} />
                )}
              </>
            ) : (
              <Text className="">{lessonTitle}</Text>
            )}
          </div>
          <Collapse in={opened}>
            <Text size="sm">{description}</Text>
          </Collapse>
        </div>
        <div className="flex space-x-5 items-center mr-2">
          {type === 'video' && (
            <Anchor component={Link} to="" size="xs" className="text-sm">
              Preview
            </Anchor>
          )}
          <Text size="sm">{secondsToTime(duration)}</Text>
        </div>
      </div>
      <ActionIcon component={Link} to={`/course-builder/content/edit-section`}>
        <RiEditBoxLine color="cyan" size={15} />
      </ActionIcon>
      <ActionIcon component={Link} to={`/course-builder/content/delete-section`}>
        <RiDeleteBin6Line color="red" size={15} />
      </ActionIcon>
    </div>
  );
}

export default CourseLessonList;
