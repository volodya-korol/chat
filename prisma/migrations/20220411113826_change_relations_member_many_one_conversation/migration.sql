/*
  Warnings:

  - You are about to drop the `_ConversationToMember` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `conversationId` to the `Member` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ConversationToMember" DROP CONSTRAINT "_ConversationToMember_A_fkey";

-- DropForeignKey
ALTER TABLE "_ConversationToMember" DROP CONSTRAINT "_ConversationToMember_B_fkey";

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "conversationId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_ConversationToMember";

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
