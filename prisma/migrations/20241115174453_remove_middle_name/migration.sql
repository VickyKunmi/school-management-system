/*
  Warnings:

  - You are about to drop the column `middleName` on the `Parent` table. All the data in the column will be lost.
  - You are about to drop the column `middleName` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `middleName` on the `Teacher` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Parent" DROP COLUMN "middleName";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "middleName";

-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "middleName";
