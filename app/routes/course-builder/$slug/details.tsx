import { ActionIcon, Box, Button, Divider, InputWrapper, TextInput } from '@mantine/core';
import { Form, useActionData, useMatches, useTransition } from '@remix-run/react';
import { useState } from 'react';
import { RichText } from '~/components/RichText';
import type { Course } from '~/utils/types';
import { RiAddCircleLine, RiDeleteBin6Line } from 'react-icons/ri';
import type { ActionFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { json } from '@remix-run/node';
import { prisma } from '~/utils/db.server';
import slugify from 'slugify';

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const courseId = formData.get('courseId');
  let message;
  if (formData.get('action') === 'add_wyl') {
    formData.forEach(async (value, key) => {
      if (key.startsWith('wyl-')) {
        const id = key.split('-')[1];
        await prisma.course_what_you_learn.upsert({
          where: { id: +id },
          update: { whatYoullLearn: value.toString() },
          create: { whatYoullLearn: value.toString(), courseId: Number(courseId) },
        });
      }
    });
    await prisma.course_what_you_learn.create({
      data: { whatYoullLearn: '', courseId: Number(courseId) },
    });
    return null;
  }
  if (formData.get('action') === 'save_course') {
    const title = formData.get('title') as string;
    const brief = formData.get('brief') as string;
    const description = formData.get('description') as string;
    const slug = slugify(title, { lower: true });

    formData.forEach(async (value, key) => {
      if (key.startsWith('wyl-')) {
        const id = key.split('-')[1];
        await prisma.course_what_you_learn.upsert({
          where: { id: +id },
          update: { whatYoullLearn: value.toString() },
          create: { whatYoullLearn: value.toString(), courseId: Number(courseId) },
        });
      }
    });
    try {
      message = await prisma.course.update({
        where: { id: Number(courseId) },
        data: {
          title,
          slug,
          brief,
          description,
        },
      });
      return redirect(`/course-builder/${slug}/details`);
    } catch (e) {
      return json({ error: 'Course with same title already exists' });
    }
  }
  if (formData.get('action')?.toString().startsWith('del_wyl')) {
    const id = formData.get('action')?.toString().split('-')[1];
    await prisma.course_what_you_learn.delete({ where: { id: Number(id) } });
  }

  return message;
};

function CourseDetails() {
  const { course } = useMatches()[2].data as { course: Course };
  const error = useActionData() as { error: string | null };
  const [value, onChange] = useState(course.description || '');
  const transition = useTransition();
  const loader = transition.state === 'submitting' || transition.state === 'loading' ? true : false;
  return (
    <Form method="post" className="flex flex-col space-y-3">
      <TextInput
        placeholder="Title"
        label="Course title"
        required
        name="title"
        defaultValue={course.title}
        {...(error && { error: error.error })}
      />
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
      <input hidden name="description" value={value} readOnly />
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
          course.whatYouLearn.map((item, index) => (
            <div key={item.id} className="flex items-center space-x-2">
              <TextInput
                placeholder="What is output of this course"
                required
                name={`wyl-${item.id}`}
                defaultValue={item.whatYoullLearn}
                className="grow"
              />
              {index > 0 && (
                <ActionIcon component="button" type="submit" name="action" value={`del_wyl-${item.id}`}>
                  <RiDeleteBin6Line color="red" size={15} />
                </ActionIcon>
              )}
            </div>
          ))
        ) : (
          <TextInput placeholder="What is output of this course" required name="wyl-0" defaultValue={undefined} />
        )}
        <input hidden readOnly name="courseId" defaultValue={course.id} />
        {course.whatYouLearn.length < 11 && (
          <div className="flex justify-center">
            <Button
              type="submit"
              variant="subtle"
              leftIcon={<RiAddCircleLine size={17} />}
              className="w-[200px]"
              name="action"
              value="add_wyl"
              loading={loader}
            >
              Add WYL field
            </Button>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <Button type="submit" loading={loader} name="action" value="save_course" variant="light" className="w-[250px]">
          Save course details
        </Button>
      </div>
    </Form>
  );
}

export default CourseDetails;
