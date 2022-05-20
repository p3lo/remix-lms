-- CreateTable
CREATE TABLE "course_progress" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "lessonId" INTEGER NOT NULL,
    "videoProgress" INTEGER,
    "quizResults" JSONB,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "course_progress_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "course_progress" ADD CONSTRAINT "course_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_progress" ADD CONSTRAINT "course_progress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "course_content_lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
