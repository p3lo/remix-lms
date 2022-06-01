import { Avatar, Button, Divider, Spoiler, Text, Title, TypographyStylesProvider } from '@mantine/core';
import type { Course } from '~/utils/types';

function Overview({ course }: { course: Course }) {
  return (
    <div className="p-5 flex flex-col space-y-5">
      <div className="px-5 flex flex-col space-y-2">
        <Title order={3}>About this course</Title>
        <Text>{course.brief}</Text>
      </div>
      <Divider />
      <div className="px-5 grid grid-cols-5">
        <Text>Certificates</Text>
        <div className="col-span-4">
          <div className="flex flex-col space-y-2">
            <Text>Get Udemy certificate by completing entire course</Text>
            <Button className="w-[200px]" disabled>
              Get Certificate
            </Button>
          </div>
        </div>
      </div>
      <Divider />
      <div className="px-5 grid grid-cols-5">
        <Text>Description</Text>
        <div className="col-span-4">
          <Spoiler maxHeight={200} showLabel="Show more" hideLabel="Hide">
            <TypographyStylesProvider>
              <div className="text-sm" dangerouslySetInnerHTML={{ __html: course.description }} />
            </TypographyStylesProvider>
          </Spoiler>
        </div>
      </div>
      <Divider />
      <div className="px-5 grid grid-cols-5">
        <Text>Instructor</Text>
        <div className="col-span-4">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-3">
              <Avatar src={course.author.picture} alt="author" radius="xl" size={65} />
              <div className="flex flex-col">
                <Text>{course.author.name}</Text>
                <Text size="xs" color="gray" className="opacity-70 ">
                  {course.author.headline}
                </Text>
              </div>
            </div>
            <Spoiler maxHeight={200} showLabel="Show more" hideLabel="Hide">
              <TypographyStylesProvider>
                <div className="text-sm" dangerouslySetInnerHTML={{ __html: course.author.bio }} />
              </TypographyStylesProvider>
            </Spoiler>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Overview;
