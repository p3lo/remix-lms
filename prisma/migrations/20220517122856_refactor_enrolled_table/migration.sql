/*
  Warnings:

  - You are about to drop the `_ENROLLED_IN` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ENROLLED_IN" DROP CONSTRAINT "_ENROLLED_IN_A_fkey";

-- DropForeignKey
ALTER TABLE "_ENROLLED_IN" DROP CONSTRAINT "_ENROLLED_IN_B_fkey";

-- DropTable
DROP TABLE "_ENROLLED_IN";

-- CreateTable
CREATE TABLE "enrolled_course" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,

    CONSTRAINT "enrolled_course_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "enrolled_course_userId_key" ON "enrolled_course"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "enrolled_course_courseId_key" ON "enrolled_course"("courseId");

-- AddForeignKey
ALTER TABLE "enrolled_course" ADD CONSTRAINT "enrolled_course_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrolled_course" ADD CONSTRAINT "enrolled_course_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
