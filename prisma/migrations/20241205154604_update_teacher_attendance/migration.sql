/*
  Warnings:

  - A unique constraint covering the columns `[teacherId,date]` on the table `TeacherAttendance` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TeacherAttendance_teacherId_date_key" ON "TeacherAttendance"("teacherId", "date");
