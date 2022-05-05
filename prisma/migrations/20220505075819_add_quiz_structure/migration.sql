-- CreateTable
CREATE TABLE "quiz" (
    "id" SERIAL NOT NULL,
    "lessonId" INTEGER NOT NULL,

    CONSTRAINT "quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_question" (
    "id" SERIAL NOT NULL,
    "quizId" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "quiz_question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_answer" (
    "id" SERIAL NOT NULL,
    "questionId" INTEGER NOT NULL,
    "answer" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "commentOnWrongAnswer" TEXT,

    CONSTRAINT "quiz_answer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "quiz" ADD CONSTRAINT "quiz_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "course_content_lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_question" ADD CONSTRAINT "quiz_question_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_answer" ADD CONSTRAINT "quiz_answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "quiz_question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
