import { Button, Chip, Chips, Divider, Modal, Paper, Text } from '@mantine/core';
import { useFetcher, useNavigate, useTransition } from '@remix-run/react';
import { useEffect, useState } from 'react';
import type { Quiz } from '~/utils/types';

function PreviewModalQuiz({ quiz, title, slug }: { quiz: Quiz; title: string; slug: string }) {
  const [opened, setOpened] = useState(false);
  const fetcher = useFetcher() as any;
  const navigate = useNavigate();
  const transition = useTransition();
  const loader = transition.state === 'submitting' || transition.state === 'loading' ? true : false;
  useEffect(() => {
    setTimeout(() => {
      setOpened((prev) => !prev);
    }, 1);
  }, []);
  function onDismiss() {
    setOpened((prev) => !prev);
    setTimeout(() => {
      navigate(`/course-builder/${slug}/content`);
    }, 100);
  }
  return (
    <Modal opened={opened} onClose={onDismiss} title={title} size="lg">
      <div className="grow">
        <Paper
          sx={(theme) => ({
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[9] : theme.colors.gray[2],
          })}
          shadow="md"
          p="sm"
          withBorder
        >
          {fetcher.data ? (
            <div className="flex flex-col space-y-1">
              {quiz.question.map((question) => {
                const correctIndex = fetcher.data.findIndex((item: any) => item.qId === question.id);
                const selected = fetcher.data[correctIndex]?.answer;
                const correctAid = fetcher.data[correctIndex]?.correctAId;
                return (
                  <div key={question.id} className="flex flex-col space-y-3">
                    <Text size="sm">Question: {question.question}</Text>
                    {question.answer.map((answer) =>
                      answer.id === selected ? (
                        answer.id === correctAid ? (
                          <Chip
                            key={answer.id}
                            size="sm"
                            variant="filled"
                            checked={true}
                            styles={{ label: { color: 'green' }, checkIcon: { color: 'green' } }}
                          >
                            {answer.answer}
                          </Chip>
                        ) : (
                          <Chip
                            key={answer.id}
                            size="sm"
                            variant="filled"
                            checked={true}
                            styles={{ label: { color: 'red' }, checkIcon: { color: 'red' } }}
                          >
                            {answer.answer}
                          </Chip>
                        )
                      ) : answer.id === correctAid ? (
                        <Chip
                          key={answer.id}
                          size="sm"
                          variant="filled"
                          checked={false}
                          styles={{ label: { color: 'green' }, checkIcon: { color: 'green' } }}
                        >
                          {answer.answer}
                        </Chip>
                      ) : (
                        <Chip key={answer.id} size="sm" variant="filled" checked={false}>
                          {answer.answer}
                        </Chip>
                      )
                    )}
                    <Divider />
                  </div>
                );
              })}
              <Button className="w-[200px] mx-auto mt-5" onClick={onDismiss} loading={loader}>
                Close
              </Button>
            </div>
          ) : (
            <fetcher.Form
              method="post"
              action={`/course-builder/${slug}/content/preview-quiz`}
              className="flex flex-col space-y-2 "
            >
              {quiz.question.map((question) => (
                <>
                  <Text key={question.id} size="sm">
                    Question: {question.question}
                  </Text>
                  <Chips variant="filled" direction="column" name={`select-${question.id}`} grow>
                    {question.answer.map((answer) => (
                      <Chip key={answer.id} value={answer.id}>
                        {answer.answer}
                      </Chip>
                    ))}
                  </Chips>
                  <Divider />
                </>
              ))}
              <Button className="w-[200px] mx-auto mt-5" type="submit" loading={loader}>
                Submit quiz
              </Button>
            </fetcher.Form>
          )}
        </Paper>
      </div>
    </Modal>
  );
}

export default PreviewModalQuiz;
