/*
  Warnings:

  - Added the required column `LineNum` to the `receipthistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `LineNum` to the `receiptItems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `receipthistory` ADD COLUMN `LineNum` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `receiptitems` ADD COLUMN `LineNum` INTEGER NOT NULL;
