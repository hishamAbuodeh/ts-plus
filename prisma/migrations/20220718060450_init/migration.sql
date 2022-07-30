-- CreateTable
CREATE TABLE `requestItems` (
    `id` INTEGER NOT NULL,
    `ItemCode` VARCHAR(191) NOT NULL,
    `ItemName` VARCHAR(191) NOT NULL,
    `ListNum` INTEGER NOT NULL,
    `ListName` VARCHAR(191) NOT NULL,
    `OnHand` DECIMAL(10, 6) NOT NULL DEFAULT 0,
    `MinStock` DECIMAL(10, 6) NOT NULL DEFAULT 0,
    `MaxStock` DECIMAL(10, 6) NOT NULL DEFAULT 0,
    `Price` DECIMAL(10, 6) NOT NULL DEFAULT 0,
    `BuyUnitMsr` VARCHAR(191) NOT NULL DEFAULT 'Piece',
    `WhsCode` VARCHAR(191) NOT NULL,
    `WhsName` VARCHAR(191) NOT NULL,
    `CodeBars` VARCHAR(191) NOT NULL DEFAULT 'no bar code',
    `ConvFactor` DECIMAL(10, 6) NOT NULL DEFAULT 0,
    `Warehousefrom` VARCHAR(191) NOT NULL DEFAULT '',
    `Warehouses` VARCHAR(191) NOT NULL DEFAULT '',
    `Order` DECIMAL(10, 6) NOT NULL DEFAULT 0,
    `Status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `GenCode` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `requestItems_id_key`(`id`),
    UNIQUE INDEX `requestItems_ItemCode_key`(`ItemCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rquestOrderhistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ItemCode` VARCHAR(191) NOT NULL,
    `ItemName` VARCHAR(191) NOT NULL,
    `ListNum` INTEGER NOT NULL,
    `ListName` VARCHAR(191) NOT NULL,
    `OnHand` DECIMAL(10, 6) NOT NULL DEFAULT 0,
    `MinStock` DECIMAL(10, 6) NOT NULL DEFAULT 0,
    `MaxStock` DECIMAL(10, 6) NOT NULL DEFAULT 0,
    `Price` DECIMAL(10, 6) NOT NULL DEFAULT 0,
    `BuyUnitMsr` VARCHAR(191) NOT NULL,
    `WhsCode` VARCHAR(191) NOT NULL,
    `WhsName` VARCHAR(191) NOT NULL,
    `CodeBars` VARCHAR(191) NOT NULL DEFAULT 'no bar code',
    `ConvFactor` DECIMAL(10, 6) NOT NULL DEFAULT 0,
    `Warehousefrom` VARCHAR(191) NOT NULL DEFAULT '',
    `Order` DECIMAL(10, 6) NOT NULL DEFAULT 0,
    `Status` VARCHAR(191) NOT NULL,
    `GenCode` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `receiptItems` (
    `id` INTEGER NOT NULL,
    `ItemCode` VARCHAR(191) NOT NULL,
    `Dscription` VARCHAR(191) NOT NULL,
    `CodeBars` VARCHAR(191) NOT NULL DEFAULT 'no bar code',
    `WhsCode` VARCHAR(191) NOT NULL,
    `CardName` VARCHAR(191) NOT NULL,
    `CardCode` VARCHAR(191) NOT NULL,
    `DocNum` INTEGER NOT NULL,
    `Status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `UgpName` VARCHAR(191) NOT NULL,
    `Order` DECIMAL(10, 6) NOT NULL,
    `OpenQty` DECIMAL(10, 6) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `receiptItems_id_key`(`id`),
    UNIQUE INDEX `receiptItems_ItemCode_key`(`ItemCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `receipthistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ItemCode` VARCHAR(191) NOT NULL,
    `Dscription` VARCHAR(191) NOT NULL,
    `CodeBars` VARCHAR(191) NOT NULL DEFAULT 'no bar code',
    `WhsCode` VARCHAR(191) NOT NULL,
    `CardName` VARCHAR(191) NOT NULL,
    `CardCode` VARCHAR(191) NOT NULL,
    `DocNum` INTEGER NOT NULL,
    `Status` VARCHAR(191) NOT NULL DEFAULT 'received',
    `UgpName` VARCHAR(191) NOT NULL,
    `Order` DECIMAL(10, 6) NOT NULL,
    `OpenQty` DECIMAL(10, 6) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
