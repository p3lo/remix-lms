import { ActionIcon, Badge, Image, List, Popover, Text, UnstyledButton } from '@mantine/core';
import { Link } from '@remix-run/react';
import { useState } from 'react';
import { RiCheckLine, RiEditBoxLine } from 'react-icons/ri';
import type { Course } from '~/utils/types';

function CourseItem({ course, owner }: { course: Course; owner?: boolean }) {
  return (
    <div className="relative w-[250px] h-[300px]">
      <UnstyledButton component={Link} to={`/course/${course.slug}`}>
        <div className="group cursor-pointer">
          <div className="flex flex-col ">
            <Image
              height={150}
              src={course.image}
              alt="With default placeholder"
              withPlaceholder={course.image ? false : true}
              fit="contain"
              className="group-hover:opacity-50"
            />
            <div className="flex flex-col py-2 space-y-1">
              <Text weight={700} lineClamp={2}>
                {course.title}
              </Text>
              <Text size="xs" color="dimmed" lineClamp={1}>
                {course.author.name}
              </Text>
              <Text weight={700}>{course.price ? `$ ${course.price}` : 'Free'}</Text>
            </div>
          </div>
        </div>
      </UnstyledButton>
      {course.isDraft && (
        <Badge component={Link} to="/kokot" className="absolute inset-0" color="red">
          Draft
        </Badge>
      )}
      {owner && (
        <ActionIcon
          className="absolute bottom-[25%] right-0"
          mt={15}
          component={Link}
          to={`/course-builder/${course.slug}/details`}
        >
          <RiEditBoxLine color="cyan" size={15} />
        </ActionIcon>
      )}
    </div>
  );
}

function CourseContainerFrontCol({ course, owner }: { course: Course; owner?: boolean }) {
  const [opened, setOpened] = useState(false);
  return (
    <Popover
      opened={opened}
      onClose={() => setOpened(false)}
      position="right"
      placement="center"
      withArrow
      trapFocus={false}
      closeOnEscape={true}
      transition="pop-top-left"
      width={260}
      styles={{ body: { pointerEvents: 'none' } }}
      target={
        <div onMouseEnter={() => setOpened(true)} onMouseLeave={() => setOpened(false)}>
          <CourseItem course={course} owner={owner} />
        </div>
      }
    >
      <List spacing="xs" size="sm" center icon={<RiCheckLine size={16} />}>
        {course.whatYouLearn.map((item) => (
          <List.Item key={item.id}>{item.whatYoullLearn}</List.Item>
        ))}
      </List>
    </Popover>
  );
}

export default CourseContainerFrontCol;
