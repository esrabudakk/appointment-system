/*
  Warnings:

  - Added the required column `hashedPassword` to the `ClientUsers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hashedPassword` to the `Customers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ClientUsers" ADD COLUMN     "hashedPassword" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Customers" ADD COLUMN     "hashedPassword" TEXT NOT NULL;
