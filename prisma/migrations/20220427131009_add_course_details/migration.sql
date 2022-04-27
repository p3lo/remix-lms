-- CreateTable
CREATE TABLE "course" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT E'en',
    "brief" TEXT,
    "description" TEXT,
    "image" TEXT,
    "preview" TEXT,
    "requirements" TEXT,
    "price" INTEGER,

    CONSTRAINT "course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_what_you_learn" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER NOT NULL,
    "what_you_learn" TEXT NOT NULL,

    CONSTRAINT "course_what_you_learn_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "course_slug_key" ON "course"("slug");

-- AddForeignKey
ALTER TABLE "course_what_you_learn" ADD CONSTRAINT "course_what_you_learn_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
