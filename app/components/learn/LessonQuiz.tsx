import { Button, Chip, Chips, Text, Title } from '@mantine/core';
import { useState } from 'react';
import type { Quiz } from '~/utils/types';

function LessonQuiz({ quiz }: { quiz: Quiz }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isResult, setIsResult] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const nextQuestion = () => {
    setCurrentQuestionIndex((prev) => prev + 1);
  };
  const prevQuestion = () => {
    setCurrentQuestionIndex((prev) => prev - 1);
  };
  const optionSelect = (e: string) => {
    setSelectedAnswers((prev) => {
      let newSelectedAnswers = [...prev];
      newSelectedAnswers.splice(currentQuestionIndex, 1, +e);
      return newSelectedAnswers;
    });
  };
  const showResult = () => {
    setIsResult((prev) => !prev);
  };
  const startOver = () => {
    setIsResult((prev) => !prev);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
  };

  return (
    <div className="py-10 sm:px-20 md:px-36 xl:px-48">
      <div className="flex flex-col space-y-8">
        {isResult ? (
          <div className="flex flex-col space-y-2">
            {quiz.question.map((question, index) => (
              <div className="flex flex-col space-y-2" key={question.id}>
                <Title order={4}>{question.question}</Title>
                {question.answer.map((answer) =>
                  answer.id === selectedAnswers[index] ? (
                    answer.isCorrect ? (
                      <Chip
                        key={answer.id}
                        size="sm"
                        variant="filled"
                        checked={true}
                        value={answer.id?.toString()}
                        styles={{ label: { color: 'green' }, checkIcon: { color: 'green' } }}
                        sx={() => ({
                          fontWeight: 700,
                        })}
                      >
                        {answer.answer}
                      </Chip>
                    ) : (
                      <Chip
                        key={answer.id}
                        size="sm"
                        variant="filled"
                        checked={true}
                        value={answer.id?.toString()}
                        styles={{ label: { color: 'red' }, checkIcon: { color: 'red' } }}
                      >
                        {answer.answer}
                      </Chip>
                    )
                  ) : answer.isCorrect ? (
                    <Chip
                      key={answer.id}
                      size="sm"
                      variant="filled"
                      checked={false}
                      value={answer.id?.toString()}
                      styles={{ label: { color: 'green' }, checkIcon: { color: 'green' } }}
                      sx={() => ({
                        fontWeight: 700,
                      })}
                    >
                      {answer.answer}
                    </Chip>
                  ) : (
                    <Chip key={answer.id} size="sm" variant="filled" checked={false} value={answer.id?.toString()}>
                      {answer.answer}
                    </Chip>
                  )
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col space-y-2">
            <Text size="sm">Question:</Text>
            {quiz.question.map(
              (question, index) =>
                index === currentQuestionIndex && (
                  <div className="flex flex-col space-y-2" key={question.id}>
                    <Title order={4}>{question.question}</Title>
                    <Chips
                      onChange={optionSelect}
                      variant="filled"
                      direction="column"
                      name={question.id?.toString()}
                      grow
                      value={selectedAnswers[index]?.toString()}
                    >
                      {question.answer.map((answer) => (
                        <Chip key={answer.id} size="sm" variant="filled" value={answer.id?.toString()}>
                          {answer.answer}
                        </Chip>
                      ))}
                    </Chips>
                  </div>
                )
            )}
          </div>
        )}

        {isResult ? (
          <div className="flex justify-center">
            <Button variant="subtle" className="w-[200px]" onClick={startOver}>
              Start over
            </Button>
          </div>
        ) : (
          <div className="flex justify-between">
            <Button
              variant="subtle"
              className="w-[200px]"
              disabled={quiz.question[0].id === quiz.question[currentQuestionIndex].id}
              onClick={prevQuestion}
            >
              Previous
            </Button>
            {quiz.question[quiz.question.length - 1].id === quiz.question[currentQuestionIndex].id ? (
              <Button variant="subtle" className="w-[200px]" onClick={showResult}>
                Show results
              </Button>
            ) : (
              <Button variant="subtle" className="w-[200px]" onClick={nextQuestion}>
                Next
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default LessonQuiz;
