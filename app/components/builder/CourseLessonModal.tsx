import {
  Button,
  Divider,
  LoadingOverlay,
  Modal,
  Paper,
  RingProgress,
  Select,
  Switch,
  Text,
  TextInput,
} from '@mantine/core';
import Uppy from '@uppy/core';
import AwsS3Multipart from '@uppy/aws-s3-multipart';
import { FileInput, useUppy } from '@uppy/react';

import { useFetcher, useMatches, useNavigate, useTransition } from '@remix-run/react';
import type { Course, CourseLessons, CourseSections } from '~/utils/types';
import { useEffect, useState } from 'react';
import { getLessonIndex, getLessonPosition, getSectionIndex, uppyOptions } from '~/utils/helpers';
import ReactPlayer from 'react-player';

function CourseLessonModal({ sectionId, type, lessonId }: { sectionId: number; type: string; lessonId?: number }) {
  const { course } = useMatches()[2].data as { course: Course };
  const fetcher = useFetcher() as any;
  const [opened, setOpened] = useState(false);
  const navigate = useNavigate();
  const transition = useTransition();
  const loader = transition.state === 'submitting' || transition.state === 'loading' ? true : false;
  const [lesson, setLesson] = useState<CourseLessons | null>(null);
  const [progressContent, setProgressContent] = useState(0);
  const [lessonPosition, setLessonPosition] = useState(0);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoDuration, setVideoDuration] = useState(0);
  const [selectDestination, setSelectDestination] = useState<string>('cloud');
  const uppyContent = useUppy(() => {
    return new Uppy(uppyOptions('content', ['video/*'], 400, `course/${course.id}/content`))
      .use(AwsS3Multipart, {
        limit: 4,
        companionUrl: 'https://companion.dev.p3lo.com/',
        retryDelays: [0, 1000, 3000, 5000],
      })
      .on('complete', async (result) => {
        const url = result.successful[0].uploadURL;
        setProgressContent(0);
        setVideoUrl(url);
      })
      .on('upload-progress', (file, progress) => {
        setProgressContent(Math.floor((progress.bytesUploaded / progress.bytesTotal) * 100));
        // console.log(file.id, progress.bytesUploaded, progress.bytesTotal);
      });
  });
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
      setVideoDuration(lesson.duration);
      setSelectDestination(
        lesson.video.includes('youtube') ? 'youtube' : lesson.video.includes('vimeo') ? 'vimeo' : 'cloud'
      );
      setVideoUrl(lesson.video);
    }
  }, []);

  useEffect(() => {
    if (!lessonId) {
      setVideoUrl('');
    }
  }, [selectDestination]);

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
      title={type === 'new-video-lesson' ? 'Add video lesson' : 'Update video lesson'}
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
        <Divider my="xs" label="Video upload & preview" />
        <div className="flex flex-col items-center space-y-2 md:flex-row md:space-x-2 md:space-y-0">
          <Select
            label="Choose video source"
            placeholder="Pick one"
            defaultValue={selectDestination}
            onChange={setSelectDestination as any}
            className="w-full md:w-1/2"
            name="select"
            data={[
              { value: 'cloud', label: 'Upload' },
              { value: 'youtube', label: 'Youtube' },
              { value: 'vimeo', label: 'Vimeo' },
            ]}
          />
          {selectDestination !== 'cloud' && (
            <TextInput
              className="w-full md:w-1/2"
              placeholder="Video url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              required
              label="Video url"
              name="noncloud_video_url"
            />
          )}
        </div>
        {fetcher?.data?.error && (
          <Text size="xs" color="red">
            {fetcher.data.error}
          </Text>
        )}
        <div className="flex space-x-2">
          {selectDestination === 'cloud' && (
            <div className="flex flex-col space-y-1">
              <form className="relative mx-auto">
                <LoadingOverlay loaderProps={{ size: 'xs', variant: 'bars' }} visible={progressContent > 0} />
                <FileInput
                  uppy={uppyContent}
                  pretty
                  inputName="files[]"
                  locale={{ strings: { chooseFiles: 'Choose video' } }}
                />
              </form>

              {progressContent > 0 && (
                <RingProgress
                  className="mx-auto"
                  sections={[{ value: progressContent, color: 'blue' }]}
                  size={80}
                  thickness={10}
                  label={
                    <Text color="blue" weight={400} align="center" size="xs">
                      {progressContent}%
                    </Text>
                  }
                />
              )}
            </div>
          )}
          <div className="grow">
            <Paper
              sx={(theme) => ({
                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[9] : theme.colors.gray[2],
              })}
              shadow="md"
              p="sm"
              withBorder
            >
              <ReactPlayer
                config={{
                  file: {
                    attributes: {
                      onContextMenu: (e: Event) => e.preventDefault(),
                      controlsList: 'nodownload',
                    },
                  },
                }}
                controls
                width="100%"
                height={220}
                url={videoUrl}
                onDuration={(duration) => setVideoDuration(Math.floor(duration))}
              />
            </Paper>
          </div>
        </div>
        <TextInput
          placeholder="Video duration"
          label="Video duration (seconds)"
          type="number"
          required
          name="duration"
          value={videoDuration}
          onChange={(e) => setVideoDuration(+e.target.value)}
        />
        <input hidden value={sectionId} readOnly name="section" />
        <input hidden value={lessonPosition} readOnly name="position" />
        <input hidden value={videoUrl} readOnly name="video_url" />
        <input hidden value={course.slug} readOnly name="slug" />
        <input hidden value={lessonId} readOnly name="lesson" />
        <Button className="w-[150px] mx-auto" type="submit" loading={loader}>
          {type === 'new-video-lesson' ? 'Add lesson' : 'Update lesson'}
        </Button>
      </fetcher.Form>
    </Modal>
  );
}

export default CourseLessonModal;
