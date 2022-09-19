/*
  Warnings:

  - Added the required column `ScaleType` to the `countRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `countrequest` ADD COLUMN `Price` DECIMAL(10, 6) NOT NULL DEFAULT 0,
    ADD COLUMN `ScaleType` VARCHAR(191) NOT NULL;
