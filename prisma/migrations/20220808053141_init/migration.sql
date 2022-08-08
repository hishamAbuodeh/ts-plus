-- CreateTable
CREATE TABLE `deliveredItemshistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ItemCode` VARCHAR(191) NOT NULL,
    `ItemName` VARCHAR(191) NOT NULL,
    `CodeBars` VARCHAR(191) NOT NULL DEFAULT 'no bar code',
    `WhsCode` VARCHAR(191) NOT NULL,
    `WarehouseTo` VARCHAR(191) NOT NULL,
    `Order` DECIMAL(10, 6) NOT NULL DEFAULT 0,
    `Status` VARCHAR(191) NOT NULL,
    `GenCode` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
