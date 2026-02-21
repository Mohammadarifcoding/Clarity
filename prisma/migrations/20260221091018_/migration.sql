/*
  Warnings:

  - You are about to drop the column `audioUrl` on the `chat_messages` table. All the data in the column will be lost.
  - You are about to drop the column `audioSize` on the `meeting` table. All the data in the column will be lost.
  - You are about to drop the column `audioUrl` on the `meeting` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "chat_messages" DROP COLUMN "audioUrl";

-- AlterTable
ALTER TABLE "meeting" DROP COLUMN "audioSize",
DROP COLUMN "audioUrl";
