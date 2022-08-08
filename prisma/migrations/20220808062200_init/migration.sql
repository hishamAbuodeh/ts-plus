/*
  Warnings:

  - Added the required column `OrderRequest` to the `deliveredItemshistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `delivereditemshistory` ADD COLUMN `OrderRequest` DECIMAL(10, 6) NOT NULL,
    ALTER COLUMN `CodeBars` DROP DEFAULT,
    ALTER COLUMN `Order` DROP DEFAULT,
    MODIFY `Status` VARCHAR(191) NOT NULL DEFAULT 'deliverd';
