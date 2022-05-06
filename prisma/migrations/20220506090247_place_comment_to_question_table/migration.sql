/*
  Warnings:

  - You are about to drop the column `commentOnWrongAnswer` on the `quiz_answer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "quiz_answer" DROP COLUMN "commentOnWrongAnswer";

-- AlterTable
ALTER TABLE "quiz_question" ADD COLUMN     "commentOnWrongAnswer" TEXT;
