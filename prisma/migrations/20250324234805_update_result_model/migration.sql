/*
  Warnings:

  - You are about to drop the column `subjects` on the `Result` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[enrollmentId,subjectId]` on the table `Result` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `grade` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `score` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subjectId` to the `Result` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Result" DROP COLUMN "subjects",
ADD COLUMN     "grade" TEXT NOT NULL,
ADD COLUMN     "score" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "subjectId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Result_enrollmentId_subjectId_key" ON "Result"("enrollmentId", "subjectId");

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
