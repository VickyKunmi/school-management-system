/*
  Warnings:

  - You are about to drop the `_SubjectClasses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_SubjectGrades` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_SubjectClasses" DROP CONSTRAINT "_SubjectClasses_A_fkey";

-- DropForeignKey
ALTER TABLE "_SubjectClasses" DROP CONSTRAINT "_SubjectClasses_B_fkey";

-- DropForeignKey
ALTER TABLE "_SubjectGrades" DROP CONSTRAINT "_SubjectGrades_A_fkey";

-- DropForeignKey
ALTER TABLE "_SubjectGrades" DROP CONSTRAINT "_SubjectGrades_B_fkey";

-- DropTable
DROP TABLE "_SubjectClasses";

-- DropTable
DROP TABLE "_SubjectGrades";

-- CreateTable
CREATE TABLE "_GradeToSubject" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ClassToSubject" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_GradeToSubject_AB_unique" ON "_GradeToSubject"("A", "B");

-- CreateIndex
CREATE INDEX "_GradeToSubject_B_index" ON "_GradeToSubject"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ClassToSubject_AB_unique" ON "_ClassToSubject"("A", "B");

-- CreateIndex
CREATE INDEX "_ClassToSubject_B_index" ON "_ClassToSubject"("B");

-- AddForeignKey
ALTER TABLE "_GradeToSubject" ADD CONSTRAINT "_GradeToSubject_A_fkey" FOREIGN KEY ("A") REFERENCES "Grade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GradeToSubject" ADD CONSTRAINT "_GradeToSubject_B_fkey" FOREIGN KEY ("B") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassToSubject" ADD CONSTRAINT "_ClassToSubject_A_fkey" FOREIGN KEY ("A") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassToSubject" ADD CONSTRAINT "_ClassToSubject_B_fkey" FOREIGN KEY ("B") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
