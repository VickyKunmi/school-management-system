/*
  Warnings:

  - You are about to drop the `_ClassToSubject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GradeToSubject` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ClassToSubject" DROP CONSTRAINT "_ClassToSubject_A_fkey";

-- DropForeignKey
ALTER TABLE "_ClassToSubject" DROP CONSTRAINT "_ClassToSubject_B_fkey";

-- DropForeignKey
ALTER TABLE "_GradeToSubject" DROP CONSTRAINT "_GradeToSubject_A_fkey";

-- DropForeignKey
ALTER TABLE "_GradeToSubject" DROP CONSTRAINT "_GradeToSubject_B_fkey";

-- DropTable
DROP TABLE "_ClassToSubject";

-- DropTable
DROP TABLE "_GradeToSubject";

-- CreateTable
CREATE TABLE "_SubjectGrades" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_SubjectClasses" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SubjectGrades_AB_unique" ON "_SubjectGrades"("A", "B");

-- CreateIndex
CREATE INDEX "_SubjectGrades_B_index" ON "_SubjectGrades"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SubjectClasses_AB_unique" ON "_SubjectClasses"("A", "B");

-- CreateIndex
CREATE INDEX "_SubjectClasses_B_index" ON "_SubjectClasses"("B");

-- AddForeignKey
ALTER TABLE "_SubjectGrades" ADD CONSTRAINT "_SubjectGrades_A_fkey" FOREIGN KEY ("A") REFERENCES "Grade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubjectGrades" ADD CONSTRAINT "_SubjectGrades_B_fkey" FOREIGN KEY ("B") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubjectClasses" ADD CONSTRAINT "_SubjectClasses_A_fkey" FOREIGN KEY ("A") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubjectClasses" ADD CONSTRAINT "_SubjectClasses_B_fkey" FOREIGN KEY ("B") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
