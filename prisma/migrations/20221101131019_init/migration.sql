-- DropIndex
DROP INDEX `countRequest_id_key` ON `countrequest`;

-- DropIndex
DROP INDEX `receiptItems_id_key` ON `receiptitems`;

-- DropIndex
DROP INDEX `requestItems_ItemCode_key` ON `requestitems`;

-- DropIndex
DROP INDEX `requestItems_id_key` ON `requestitems`;

-- DropIndex
DROP INDEX `requestReceiptItems_ItemCode_key` ON `requestreceiptitems`;

-- DropIndex
DROP INDEX `requestReceiptItems_id_key` ON `requestreceiptitems`;

-- DropIndex
DROP INDEX `returnItems_id_key` ON `returnitems`;

-- AlterTable
ALTER TABLE `countrequest` MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT;

-- AlterTable
ALTER TABLE `receiptitems` MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT;

-- AlterTable
ALTER TABLE `requestitems` MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT;

-- AlterTable
ALTER TABLE `requestreceiptitems` MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT;

-- AlterTable
ALTER TABLE `returnitems` MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT;
