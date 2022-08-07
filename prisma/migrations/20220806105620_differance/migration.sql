/*
  Warnings:

  - Added the required column `Difference` to the `requestReceiptItems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `requestreceiptitems` ADD COLUMN `Difference` DECIMAL(10, 6) NOT NULL;
