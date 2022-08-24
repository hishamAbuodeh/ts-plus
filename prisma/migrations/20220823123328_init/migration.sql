-- CreateTable
CREATE TABLE `countRequest` (
    `id` INTEGER NOT NULL,
    `CountingName` VARCHAR(191) NOT NULL,
    `CountingDate` DATETIME(3) NOT NULL,
    `ItemCode` VARCHAR(191) NOT NULL,
    `ItemName` VARCHAR(191) NOT NULL,
    `BuyUnitMsr` VARCHAR(191) NOT NULL,
    `WhsCode` VARCHAR(191) NOT NULL,
    `CodeBars` VARCHAR(191) NOT NULL DEFAULT 'no bar code',
    `Note` VARCHAR(191) NOT NULL,
    `Qnty` DECIMAL(10, 6) NOT NULL DEFAULT 0,
    `Status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `countRequest_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `countHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `CountingName` VARCHAR(191) NOT NULL,
    `CountingDate` DATETIME(3) NOT NULL,
    `ItemCode` VARCHAR(191) NOT NULL,
    `ItemName` VARCHAR(191) NOT NULL,
    `BuyUnitMsr` VARCHAR(191) NOT NULL,
    `WhsCode` VARCHAR(191) NOT NULL,
    `CodeBars` VARCHAR(191) NOT NULL DEFAULT 'no bar code',
    `Note` VARCHAR(191) NOT NULL,
    `Qnty` DECIMAL(10, 6) NOT NULL DEFAULT 0,
    `Status` VARCHAR(191) NOT NULL DEFAULT 'sent',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
