-- CreateTable
CREATE TABLE "course_qa_question" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "course_qa_question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_qa_answer" (
    "id" SERIAL NOT NULL,
    "questionId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "course_qa_answer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "course_qa_question" ADD CONSTRAINT "course_qa_question_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_qa_question" ADD CONSTRAINT "course_qa_question_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_qa_answer" ADD CONSTRAINT "course_qa_answer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_qa_answer" ADD CONSTRAINT "course_qa_answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "course_qa_question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
