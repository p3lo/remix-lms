/*
  Warnings:

  - A unique constraint covering the columns `[lessonId]` on the table `quiz` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "quiz_lessonId_key" ON "quiz"("lessonId");
