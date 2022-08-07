-- CreateTable
CREATE TABLE `requestReceiptItems` (
    `id` INTEGER NOT NULL,
    `ItemCode` VARCHAR(191) NOT NULL,
    `ItemName` VARCHAR(191) NOT NULL,
    `ListNum` INTEGER NOT NULL,
    `ListName` VARCHAR(191) NOT NULL,
    `OnHand` DECIMAL(10, 6) NOT NULL,
    `MinStock` DECIMAL(10, 6) NOT NULL,
    `MaxStock` DECIMAL(10, 6) NOT NULL,
    `Price` DECIMAL(10, 6) NOT NULL,
    `BuyUnitMsr` VARCHAR(191) NOT NULL DEFAULT 'Piece',
    `WhsCode` VARCHAR(191) NOT NULL,
    `WhsName` VARCHAR(191) NOT NULL,
    `CodeBars` VARCHAR(191) NOT NULL DEFAULT 'no bar code',
    `ConvFactor` DECIMAL(10, 6) NOT NULL,
    `Warehousefrom` VARCHAR(191) NOT NULL DEFAULT '',
    `OrderRequest` DECIMAL(10, 6) NOT NULL,
    `Order` DECIMAL(10, 6) NOT NULL DEFAULT 0,
    `Status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `GenCode` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `requestReceiptItems_id_key`(`id`),
    UNIQUE INDEX `requestReceiptItems_ItemCode_key`(`ItemCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
