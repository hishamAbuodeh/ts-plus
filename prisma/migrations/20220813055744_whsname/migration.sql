/*
  Warnings:

  - Added the required column `WhsName` to the `deliveredItemshistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `delivereditemshistory` ADD COLUMN `WhsName` VARCHAR(191) NOT NULL;
