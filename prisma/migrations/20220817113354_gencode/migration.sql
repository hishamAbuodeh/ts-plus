/*
  Warnings:

  - Added the required column `GenCode` to the `receipthistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `receipthistory` ADD COLUMN `GenCode` VARCHAR(191) NOT NULL;
