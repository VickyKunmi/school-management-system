-- DropForeignKey
ALTER TABLE "Announcement" DROP CONSTRAINT "Announcement_classId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_classId_fkey";

-- AlterTable
ALTER TABLE "Announcement" ALTER COLUMN "classId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "classId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE SET NULL ON UPDATE CASCADE;
