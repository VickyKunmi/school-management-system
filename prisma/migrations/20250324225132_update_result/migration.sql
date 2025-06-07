/*
  Warnings:

  - You are about to drop the column `grade` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `subjectId` on the `Result` table. All the data in the column will be lost.
  - Added the required column `subjects` to the `Result` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_subjectId_fkey";

-- DropIndex
DROP INDEX "Result_enrollmentId_subjectId_key";

-- AlterTable
ALTER TABLE "Result" DROP COLUMN "grade",
DROP COLUMN "score",
DROP COLUMN "subjectId",
ADD COLUMN     "subjects" JSONB NOT NULL;
