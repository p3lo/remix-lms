import { ActionIcon, Button, Checkbox, Modal, ScrollArea, TextInput, useMantineColorScheme } from '@mantine/core';
import { useFetcher, useMatches, useNavigate, useTransition } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { RiAddCircleLine, RiDeleteBin6Line } from 'react-icons/ri';
import { getLessonIndex, getLessonPosition, getSectionIndex } from '~/utils/helpers';
import type { Course, CourseLessons, CourseSections, Quiz, QuizQuestion } from '~/utils/types';

const initialQuiz = {
  question: '',
  position: 0,
  commentOnWrongAnswer: '',
  answer: [
    {
      answer: '',
      isCorrect: true,
    },
    {
      answer: '',
      isCorrect: false,
    },
  ],
} as QuizQuestion;

function CourseLessonQuizModal({ sectionId, type, lessonId }: { sectionId: number; type: string; lessonId?: number }) {
  const { course } = useMatches()[2].data as { course: Course };
  const fetcher = useFetcher() as any;
  const [opened, setOpened] = useState(false);
  const navigate = useNavigate();
  const transition = useTransition();
  const loader = transition.state === 'submitting' || transition.state === 'loading' ? true : false;
  const [lesson, setLesson] = useState<CourseLessons | null>(null);
  const [lessonPosition, setLessonPosition] = useState(0);
  const [quiz, setQuiz] = useState<Quiz>({ question: [initialQuiz] });
  const [lessonDuration, setLessonDuration] = useState(0);
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
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
      console.log(lesson);
      setQuiz(lesson.quiz[0]);
      setLessonDuration(lesson.duration);
    }
  }, []);
  function onDismiss() {
    setOpened((prev) => !prev);
    setTimeout(() => {
      navigate(`/course-builder/${course.slug}/content`);
    }, 100);
  }
  function addQuestion() {
    setQuiz((prev) => ({ ...prev, question: [...prev.question, initialQuiz] }));
  }
  function addAnswer(questionIndex: number) {
    setQuiz((prev) => ({
      ...prev,
      question: prev.question.map((question, i) => {
        if (i !== questionIndex) return question;
        return {
          ...question,
          answer: [...question.answer, { answer: '', isCorrect: false, commentOnWrongAnswer: '' }],
        };
      }),
    }));
  }
  function removeQuestion(index: number) {
    setQuiz((prev) => ({
      ...prev,
      question: prev.question.filter((_, i) => i !== index),
    }));
  }
  function removeAnswer(questionIndex: number, answerIndex: number) {
    setQuiz((prev) => ({
      ...prev,
      question: prev.question.map((question, i) => {
        if (i !== questionIndex) return question;
        return {
          ...question,
          answer: question.answer.filter((_, i) => i !== answerIndex),
        };
      }),
    }));
  }
  return (
    <Modal
      opened={opened}
      onClose={onDismiss}
      title={type === 'new-quiz-lesson' ? 'Add quiz lesson' : 'Update quiz lesson'}
      size="lg"
    >
      <ScrollArea style={{ height: '70vh' }} offsetScrollbars>
        <fetcher.Form
          className="flex flex-col space-y-2"
          method="post"
          action={
            lesson
              ? `/course-builder/${course.slug}/content/${type}?sectionId=${sectionId}&lessonId=${lessonId}`
              : `/course-builder/${course.slug}/content/${type}?sectionId=${sectionId}`
          }
        >
          <TextInput
            placeholder="Quiz title"
            label="Quiz title"
            required
            name="title"
            defaultValue={lesson?.lessonTitle}
          />
          {quiz.question.map((question, indexq) => (
            <div className={`flex flex-col space-y-1 p-2 ${dark ? 'bg-zinc-900' : 'bg-zinc-100'}`} key={indexq}>
              <div className="flex items-center">
                <TextInput
                  placeholder="Question"
                  label={`${indexq + 1}. Question`}
                  required
                  name={`quiz-question-${indexq}`}
                  defaultValue={question.question}
                  className="grow"
                />

                <ActionIcon mt={25} component={Button}>
                  <RiAddCircleLine color="cyan" size={15} onClick={() => addAnswer(indexq)} />
                </ActionIcon>
                {indexq > 0 && (
                  <ActionIcon mt={25} component={Button}>
                    <RiDeleteBin6Line color="red" size={15} onClick={() => removeQuestion(indexq)} />
                  </ActionIcon>
                )}
              </div>
              {question.answer.map((answer, indexa) => (
                <div className="flex items-center" key={indexa}>
                  {answer.isCorrect ? (
                    <Checkbox size="xs" mt={25} name={`quiz-correct-answer-${indexq}-${indexa}`} defaultChecked />
                  ) : (
                    <Checkbox size="xs" mt={25} name={`quiz-correct-answer-${indexq}-${indexa}`} />
                  )}

                  <TextInput
                    key={indexa}
                    placeholder="Answer"
                    label={`${indexa + 1}. Answer`}
                    required
                    name={`quiz-answer-${indexq}-${indexa}`}
                    defaultValue={answer.answer}
                    className="ml-2 grow"
                  />
                  {indexa > 1 && (
                    <ActionIcon mt={25} component={Button}>
                      <RiDeleteBin6Line color="red" size={15} onClick={() => removeAnswer(indexq, indexa)} />
                    </ActionIcon>
                  )}
                </div>
              ))}
            </div>
          ))}
          <input hidden value={sectionId} readOnly name="section" />
          <input hidden value={lessonPosition} readOnly name="position" />
          <input hidden value={course.slug} readOnly name="slug" />
          <input hidden value={lessonId} readOnly name="lesson" />
          <Button
            variant="subtle"
            leftIcon={<RiAddCircleLine size={17} />}
            className="w-full md:w-[33.33%] mx-auto"
            color="cyan"
            size="xs"
            onClick={addQuestion}
          >
            Add question
          </Button>
          <TextInput
            placeholder="Quiz duration"
            label="Quiz duration (seconds)"
            type="number"
            required
            name="duration"
            value={lessonDuration}
            onChange={(e) => setLessonDuration(+e.target.value)}
          />
          <Button className="w-[150px] mx-auto mt-5" type="submit" loading={loader}>
            {type === 'new-quiz-lesson' ? 'Add lesson' : 'Update lesson'}
          </Button>
        </fetcher.Form>
      </ScrollArea>
    </Modal>
  );
}

export default CourseLessonQuizModal;
