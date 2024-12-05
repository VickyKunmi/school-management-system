/*
  Warnings:

  - The `status` column on the `TeacherAttendance` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('Present', 'Absent');

-- AlterTable
ALTER TABLE "TeacherAttendance" DROP COLUMN "status",
ADD COLUMN     "status" "AttendanceStatus" NOT NULL DEFAULT 'Absent';
