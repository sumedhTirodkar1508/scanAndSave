/*
  Warnings:

  - You are about to drop the `SaviorProfile` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `bloodGroup` to the `QRCode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `relativePhone` to the `QRCode` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SaviorQRCode" DROP CONSTRAINT "SaviorQRCode_saviorId_fkey";

-- AlterTable
ALTER TABLE "QRCode" ADD COLUMN     "bloodGroup" TEXT NOT NULL,
ADD COLUMN     "medication" TEXT,
ADD COLUMN     "relativePhone" TEXT NOT NULL,
ADD COLUMN     "sickness" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isTemporary" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "profileImageUrl" TEXT,
ADD COLUMN     "tempStartTime" TIMESTAMP(3);

-- DropTable
DROP TABLE "SaviorProfile";

-- CreateTable
CREATE TABLE "AccidentPhoto" (
    "id" TEXT NOT NULL,
    "qrCodeId" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccidentPhoto_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SaviorQRCode" ADD CONSTRAINT "SaviorQRCode_saviorId_fkey" FOREIGN KEY ("saviorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccidentPhoto" ADD CONSTRAINT "AccidentPhoto_qrCodeId_fkey" FOREIGN KEY ("qrCodeId") REFERENCES "QRCode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
