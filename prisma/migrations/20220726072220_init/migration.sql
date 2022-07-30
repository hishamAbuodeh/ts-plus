/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `rquestorderhistory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `rquestorderhistory` DROP COLUMN `updatedAt`;

-- CreateTable
CREATE TABLE `returnItems` (
    `id` INTEGER NOT NULL,
    `ItemCode` VARCHAR(191) NOT NULL,
    `ItemName` VARCHAR(191) NOT NULL,
    `CodeBars` VARCHAR(191) NOT NULL DEFAULT 'no bar code',
    `WhsCode` VARCHAR(191) NOT NULL,
    `DocNum` INTEGER NOT NULL DEFAULT 0,
    `Status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `BuyUnitMsr` VARCHAR(191) NOT NULL,
    `Order` DECIMAL(10, 6) NOT NULL,
    `OpenQty` DECIMAL(10, 6) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `returnItems_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `returnhistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ItemCode` VARCHAR(191) NOT NULL,
    `ItemName` VARCHAR(191) NOT NULL,
    `CodeBars` VARCHAR(191) NOT NULL DEFAULT 'no bar code',
    `WhsCode` VARCHAR(191) NOT NULL,
    `DocNum` INTEGER NOT NULL DEFAULT 0,
    `Status` VARCHAR(191) NOT NULL DEFAULT 'received',
    `BuyUnitMsr` VARCHAR(191) NOT NULL,
    `Order` DECIMAL(10, 6) NOT NULL,
    `OpenQty` DECIMAL(10, 6) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
