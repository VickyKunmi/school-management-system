/*
  Warnings:

  - Made the column `signInTime` on table `TeacherAttendance` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "TeacherAttendance" ALTER COLUMN "signInTime" SET NOT NULL;
