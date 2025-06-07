-- CreateTable
CREATE TABLE "_SubjectEnrollments" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SubjectEnrollments_AB_unique" ON "_SubjectEnrollments"("A", "B");

-- CreateIndex
CREATE INDEX "_SubjectEnrollments_B_index" ON "_SubjectEnrollments"("B");

-- AddForeignKey
ALTER TABLE "_SubjectEnrollments" ADD CONSTRAINT "_SubjectEnrollments_A_fkey" FOREIGN KEY ("A") REFERENCES "Enrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubjectEnrollments" ADD CONSTRAINT "_SubjectEnrollments_B_fkey" FOREIGN KEY ("B") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
