/*
  Warnings:

  - A unique constraint covering the columns `[authorId]` on the table `course` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authorId` to the `course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "course" ADD COLUMN     "authorId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "course_authorId_key" ON "course"("authorId");

-- AddForeignKey
ALTER TABLE "course" ADD CONSTRAINT "course_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
