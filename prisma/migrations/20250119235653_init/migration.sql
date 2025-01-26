-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "QRStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "isemailVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerifiedAt" TIMESTAMP(3),
    "password" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QRCode" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "victimName" TEXT NOT NULL,
    "victimEmail" TEXT NOT NULL,
    "relativeName" TEXT NOT NULL,
    "relativeEmail" TEXT NOT NULL,
    "status" "QRStatus" NOT NULL DEFAULT 'PENDING',
    "qrCodeUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QRCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaviorProfile" (
    "id" TEXT NOT NULL,
    "saviorUsername" TEXT NOT NULL,
    "saviorName" TEXT NOT NULL,
    "saviorEmail" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SaviorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaviorQRCode" (
    "id" TEXT NOT NULL,
    "saviorId" TEXT NOT NULL,
    "qrCodeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SaviorQRCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SaviorProfile_saviorUsername_key" ON "SaviorProfile"("saviorUsername");

-- CreateIndex
CREATE UNIQUE INDEX "SaviorProfile_saviorEmail_key" ON "SaviorProfile"("saviorEmail");

-- AddForeignKey
ALTER TABLE "QRCode" ADD CONSTRAINT "QRCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaviorQRCode" ADD CONSTRAINT "SaviorQRCode_saviorId_fkey" FOREIGN KEY ("saviorId") REFERENCES "SaviorProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaviorQRCode" ADD CONSTRAINT "SaviorQRCode_qrCodeId_fkey" FOREIGN KEY ("qrCodeId") REFERENCES "QRCode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
