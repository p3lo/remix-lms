-- CreateTable
CREATE TABLE "_enrolledBy" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_enrolledBy_AB_unique" ON "_enrolledBy"("A", "B");

-- CreateIndex
CREATE INDEX "_enrolledBy_B_index" ON "_enrolledBy"("B");

-- AddForeignKey
ALTER TABLE "_enrolledBy" ADD CONSTRAINT "_enrolledBy_A_fkey" FOREIGN KEY ("A") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_enrolledBy" ADD CONSTRAINT "_enrolledBy_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
