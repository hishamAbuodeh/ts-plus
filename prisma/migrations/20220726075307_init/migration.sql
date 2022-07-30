/*
  Warnings:

  - You are about to drop the column `OpenQty` on the `returnhistory` table. All the data in the column will be lost.
  - You are about to drop the column `OpenQty` on the `returnitems` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `returnhistory` DROP COLUMN `OpenQty`,
    ALTER COLUMN `Status` DROP DEFAULT;

-- AlterTable
ALTER TABLE `returnitems` DROP COLUMN `OpenQty`;
