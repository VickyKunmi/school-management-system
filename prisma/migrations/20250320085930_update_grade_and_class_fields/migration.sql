/*
  Warnings:

  - You are about to drop the column `classId` on the `Subject` table. All the data in the column will be lost.
  - You are about to drop the column `gradeId` on the `Subject` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_classId_fkey";

-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_gradeId_fkey";

-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "classId",
DROP COLUMN "gradeId";

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
