/*
  Warnings:

  - Added the required column `genCode` to the `returnhistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `returnhistory` ADD COLUMN `genCode` VARCHAR(191) NOT NULL,
    ALTER COLUMN `DocNum` DROP DEFAULT;
