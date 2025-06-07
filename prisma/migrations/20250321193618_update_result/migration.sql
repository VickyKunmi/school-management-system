/*
  Warnings:

  - You are about to drop the column `assignmentId` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `examId` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the `Assignment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Attendance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Exam` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Lesson` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `academicYear` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `enrollmentId` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `grade` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subjectId` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `term` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Result` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "Exam" DROP CONSTRAINT "Exam_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_assignmentId_fkey";

-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_examId_fkey";

-- AlterTable
ALTER TABLE "Result" DROP COLUMN "assignmentId",
DROP COLUMN "examId",
DROP COLUMN "studentId",
ADD COLUMN     "academicYear" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "enrollmentId" INTEGER NOT NULL,
ADD COLUMN     "grade" TEXT NOT NULL,
ADD COLUMN     "subjectId" INTEGER NOT NULL,
ADD COLUMN     "term" "Term" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "score" SET DATA TYPE DOUBLE PRECISION;

-- DropTable
DROP TABLE "Assignment";

-- DropTable
DROP TABLE "Attendance";

-- DropTable
DROP TABLE "Exam";

-- DropTable
DROP TABLE "Lesson";

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
