/*
  Warnings:

  - A unique constraint covering the columns `[enrollmentId,subjectId]` on the table `Result` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Result_enrollmentId_subjectId_key" ON "Result"("enrollmentId", "subjectId");
