import { Button, Divider, InputWrapper, Modal, Switch, TextInput } from '@mantine/core';
import { useFetcher, useMatches, useNavigate, useTransition } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { getLessonIndex, getLessonPosition, getSectionIndex } from '~/utils/helpers';
import type { Course, CourseLessons, CourseSections } from '~/utils/types';
import { RichText } from '~/components/RichText';

function CourseLessonTextModal({ sectionId, type, lessonId }: { sectionId: number; type: string; lessonId?: number }) {
  const { course } = useMatches()[2].data as { course: Course };
  const fetcher = useFetcher() as any;
  const [opened, setOpened] = useState(false);
  const navigate = useNavigate();
  const transition = useTransition();
  const loader = transition.state === 'submitting' || transition.state === 'loading' ? true : false;
  const [lesson, setLesson] = useState<CourseLessons | null>(null);
  const [lessonPosition, setLessonPosition] = useState(0);
  const [content, setContent] = useState('');
  const [lessonDuration, setLessonDuration] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setOpened((prev) => !prev);
    }, 1);
    const sectionIndex = getSectionIndex(course.content, sectionId);
    const sectionFull = Object.assign({}, course.content[sectionIndex]) as CourseSections;
    setLessonPosition(getLessonPosition(sectionFull.lessons));
    if (lessonId) {
      const lessonIndex = getLessonIndex(sectionFull.lessons, +lessonId);
      const lesson = Object.assign({}, sectionFull.lessons[lessonIndex]) as CourseLessons;
      setLesson(lesson);
      setContent(lesson.textContent);
      setLessonDuration(lesson.duration);
    }
  }, []);
  function onDismiss() {
    setOpened((prev) => !prev);
    setTimeout(() => {
      navigate(`/course-builder/${course.slug}/content`);
    }, 100);
  }
  return (
    <Modal
      opened={opened}
      onClose={onDismiss}
      title={type === 'new-text-lesson' ? 'Add text lesson' : 'Update text lesson'}
      size="lg"
    >
      <fetcher.Form
        method="post"
        action={
          lesson
            ? `/course-builder/${course.slug}/content/${type}?sectionId=${sectionId}&lessonId=${lessonId}`
            : `/course-builder/${course.slug}/content/${type}?sectionId=${sectionId}`
        }
        className="flex flex-col space-y-3"
      >
        <TextInput
          placeholder="Lesson title"
          label="Lesson title"
          required
          name="title"
          defaultValue={lesson?.lessonTitle}
        />
        <Switch defaultChecked={lesson ? lesson.preview : false} label="This lesson is free preview" name="free" />
        <TextInput
          placeholder="Lesson description (optional)"
          label="Lesson description"
          name="description"
          defaultValue={lesson?.description}
        />
        <Divider my="xs" label="Text content" />
        <InputWrapper label="Learning text material" className="w-full" required>
          <RichText
            controls={[
              ['bold', 'italic', 'underline'],
              ['h1', 'h2'],
              ['unorderedList', 'orderedList'],
              ['link', 'codeBlock'],
            ]}
            id="rte"
            value={content}
            onChange={setContent}
            placeholder="Content"
            spellCheck={false}
          />
        </InputWrapper>
        <TextInput
          placeholder="Reading duration"
          label="Reading duration (seconds)"
          type="number"
          required
          name="duration"
          value={lessonDuration}
          onChange={(e) => setLessonDuration(+e.target.value)}
        />
        <input hidden value={sectionId} readOnly name="section" />
        <input hidden value={lessonPosition} readOnly name="position" />
        <input hidden value={content} readOnly name="content" />
        <input hidden value={course.slug} readOnly name="slug" />
        <input hidden value={lessonId} readOnly name="lesson" />
        <Button className="w-[150px] mx-auto" type="submit" loading={loader}>
          {type === 'new-text-lesson' ? 'Add lesson' : 'Update lesson'}
        </Button>
      </fetcher.Form>
    </Modal>
  );
}

export default CourseLessonTextModal;
