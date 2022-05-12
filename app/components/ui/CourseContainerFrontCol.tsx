import { Image, Text } from '@mantine/core';
import type { Course } from '~/utils/types';

function CourseContainerFrontCol({ course }: { course: Course }) {
  return (
    <div className="w-full xs:w-1/2 sm:w-1/3 md:w-1/4 xl:w-1/5 h-[300px] group cursor-pointer">
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
  );
}

export default CourseContainerFrontCol;
