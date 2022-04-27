import { Box, Button, Divider, InputWrapper, TextInput } from '@mantine/core';
import { Form, useMatches } from '@remix-run/react';
import { useState } from 'react';
import { RichText } from '~/components/RichText';
import type { Course } from '~/utils/types';
import { RiAddCircleLine } from 'react-icons/ri';

function CourseDetails() {
  const { course } = useMatches()[2].data as { course: Course };
  const [value, onChange] = useState(course.description || '');
  return (
    <Form method="post" className="flex flex-col space-y-3">
      <TextInput placeholder="Title" label="Course title" required name="title" defaultValue={course.title} />
      <TextInput
        placeholder="Short description of course"
        label="Brief description"
        required
        name="brief"
        defaultValue={course.brief}
      />
      <InputWrapper label="Description" required>
        <RichText
          controls={[
            ['bold', 'italic'],
            ['orderedList', 'unorderedList'],
          ]}
          id="description"
          value={value}
          onChange={onChange}
          placeholder="Full description of course"
          spellCheck={false}
        />
      </InputWrapper>
      <div className="flex flex-col space-y-1">
        <Divider
          variant="dashed"
          labelPosition="center"
          label={
            <>
              <Box ml={5}>What you'll learn (required)</Box>
            </>
          }
        />
        {course.whatYouLearn.length > 0 ? (
          course.whatYouLearn.map((item) => (
            <TextInput
              key={item.id}
              placeholder="What is output of this course"
              label="What you'll learn"
              required
              name={`wyl-${item.id}`}
              defaultValue={item.whatYoullLearn}
            />
          ))
        ) : (
          <TextInput placeholder="What is output of this course" required name="wyl" defaultValue="" />
        )}
        <div className="flex justify-center">
          <Button
            type="submit"
            name="action"
            value="add_wyl"
            variant="subtle"
            leftIcon={<RiAddCircleLine size={17} />}
            className="w-[200px]"
          >
            Add WYL field
          </Button>
        </div>
      </div>

      <div className="flex justify-center">
        <Button type="submit" name="action" value="submit" variant="light" className="w-[250px]">
          Save course details
        </Button>
      </div>
    </Form>
  );
}

export default CourseDetails;
