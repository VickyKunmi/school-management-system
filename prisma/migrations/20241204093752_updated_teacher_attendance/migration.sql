/*
  Warnings:

  - Added the required column `signOutTime` to the `TeacherAttendance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TeacherAttendance" ADD COLUMN     "signOutTime" TIMESTAMP(3) NOT NULL;
