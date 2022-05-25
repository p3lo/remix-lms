import { ActionIcon, Badge, Divider, Image, List, Paper, Popover, Text, UnstyledButton } from '@mantine/core';
import { Link } from '@remix-run/react';
import { useState } from 'react';
import { RiCheckLine, RiEditBoxLine } from 'react-icons/ri';
import type { Course } from '~/utils/types';

function CourseItem({ course, owner }: { course: Course; owner?: boolean }) {
  return (
    <Paper
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[9] : theme.colors.gray[2],
      })}
      shadow="md"
      withBorder
      className="relative w-full h-[300px]"
    >
      <UnstyledButton component={Link} prefetch="intent" to={`/course/${course.slug}`}>
        <div className="w-full h-full cursor-pointer group">
          <div className="flex flex-col ">
            <Image
              height={150}
              src={course.image}
              alt="With default placeholder"
              withPlaceholder={course.image ? false : true}
              fit="contain"
              className="group-hover:opacity-50"
            />
            <Divider />
            <div className="flex flex-col p-2 space-y-1">
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
        <Badge className="absolute inset-0" color="red">
          Draft
        </Badge>
      )}
      {owner && (
        <ActionIcon
          className="absolute bottom-[20%] right-0"
          mt={15}
          component={Link}
          prefetch="intent"
          to={`/course-builder/${course.slug}/details`}
        >
          <RiEditBoxLine color="cyan" size={15} />
        </ActionIcon>
      )}
    </Paper>
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
      trapFocus={true}
      closeOnEscape={true}
      transition="pop-top-left"
      width={260}
      gutter={1}
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
