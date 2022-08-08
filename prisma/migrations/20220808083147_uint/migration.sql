/*
  Warnings:

  - Added the required column `BuyUnitMsr` to the `deliveredItemshistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `delivereditemshistory` ADD COLUMN `BuyUnitMsr` VARCHAR(191) NOT NULL;
