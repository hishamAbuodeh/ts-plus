/*
  Warnings:

  - Added the required column `updatedAt` to the `deliveredItemshistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `receipthistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `returnhistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `rquestOrderhistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `delivereditemshistory` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `receipthistory` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `returnhistory` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `rquestorderhistory` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;
