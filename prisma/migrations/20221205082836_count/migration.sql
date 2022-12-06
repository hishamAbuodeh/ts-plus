/*
  Warnings:

  - Added the required column `CountRows` to the `rquestOrderhistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `rquestorderhistory` ADD COLUMN `CountRows` INTEGER NOT NULL;
