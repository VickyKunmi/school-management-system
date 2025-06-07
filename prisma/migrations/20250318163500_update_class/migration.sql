/*
  Warnings:

  - You are about to drop the column `supervisorId` on the `Class` table. All the data in the column will be lost.
  - You are about to drop the column `classId` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `subjectId` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the `_SubjectToTeacher` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_supervisorId_fkey";

-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_classId_fkey";

-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "_SubjectToTeacher" DROP CONSTRAINT "_SubjectToTeacher_A_fkey";

-- DropForeignKey
ALTER TABLE "_SubjectToTeacher" DROP CONSTRAINT "_SubjectToTeacher_B_fkey";

-- AlterTable
ALTER TABLE "Class" DROP COLUMN "supervisorId";

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "classId",
DROP COLUMN "subjectId";

-- DropTable
DROP TABLE "_SubjectToTeacher";
