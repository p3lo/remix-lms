/*
  Warnings:

  - You are about to drop the column `what_you_learn` on the `course_what_you_learn` table. All the data in the column will be lost.
  - Added the required column `subCategoryId` to the `course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `whatYoullLearn` to the `course_what_you_learn` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "course" ADD COLUMN     "subCategoryId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "course_what_you_learn" DROP COLUMN "what_you_learn",
ADD COLUMN     "whatYoullLearn" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "course" ADD CONSTRAINT "course_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "sub_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
