-- CreateTable
CREATE TABLE "course_content_sections" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER NOT NULL,
    "sectionTitle" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "course_content_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_content_lessons" (
    "id" SERIAL NOT NULL,
    "sectionId" INTEGER NOT NULL,
    "lessonTitle" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "video" TEXT,
    "description" TEXT,
    "duration" INTEGER,
    "type" TEXT DEFAULT E'video',

    CONSTRAINT "course_content_lessons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "course_content_sections_position_key" ON "course_content_sections"("position");

-- CreateIndex
CREATE UNIQUE INDEX "course_content_lessons_position_key" ON "course_content_lessons"("position");

-- AddForeignKey
ALTER TABLE "course_content_sections" ADD CONSTRAINT "course_content_sections_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_content_lessons" ADD CONSTRAINT "course_content_lessons_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "course_content_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
