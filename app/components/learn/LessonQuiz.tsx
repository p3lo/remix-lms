import { Button, Chip, Chips, Text, Title } from '@mantine/core';
import { useState } from 'react';
import type { Quiz } from '~/utils/types';

function LessonQuiz({ quiz }: { quiz: Quiz }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const nextQuestion = () => {
    setCurrentQuestionIndex((prev) => prev + 1);
  };
  const prevQuestion = () => {
    setCurrentQuestionIndex((prev) => prev - 1);
  };
  return (
    <div className="py-10 sm:px-20 md:px-36 xl:px-48">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col space-y-2">
          <Text size="sm">Question:</Text>
          {quiz.question.map(
            (question, index) =>
              index === currentQuestionIndex && (
                <>
                  <Title key={question.id} order={4}>
                    {question.question}
                  </Title>
                  <Chips variant="filled" direction="column" name={question.id?.toString()} grow>
                    {question.answer.map((answer) => (
                      <Chip key={answer.id} size="sm" variant="filled" value={answer.id}>
                        {answer.answer}
                      </Chip>
                    ))}
                  </Chips>
                </>
              )
          )}
        </div>
        <div className="flex justify-between">
          <Button
            variant="subtle"
            className="w-[200px]"
            disabled={quiz.question[0].id === quiz.question[currentQuestionIndex].id}
            onClick={prevQuestion}
          >
            Previous
          </Button>
          <Button
            variant="subtle"
            className="w-[200px]"
            onClick={nextQuestion}
            disabled={quiz.question[quiz.question.length - 1].id === quiz.question[currentQuestionIndex].id}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default LessonQuiz;
