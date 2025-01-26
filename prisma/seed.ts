import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create a user
  const user = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john@gmail.com",
      isemailVerified: true,
      emailVerifiedAt: new Date(),
      password: "pass", // Replace with a hashed password for production
      role: "USER",
    },
  });
  console.log("User created:", user);

  // Create a QR code associated with the user
  const qrCode = await prisma.qRCode.create({
    data: {
      userId: user.id,
      victimName: "Jane Doe",
      victimEmail: "jane.doe@example.com",
      relativeName: "Sarah Doe",
      relativePhone: "1234567890",
      relativeEmail: "sarah.doe@example.com",
      bloodGroup: "O+",
      sickness: "Asthma",
      medication: "Inhaler",
      status: "PENDING",
      qrCodeUrl:
        "https://res.cloudinary.com/doekljkgd/image/upload/v1737304837/qrcodes/lionelmessi.png",
    },
  });
  console.log("QR Code created:", qrCode);

  // Create a temporary savior account
  const savior = await prisma.user.create({
    data: {
      name: "Temporary Savior",
      email: "savior@gmail.com",
      isemailVerified: false,
      isTemporary: true,
      tempStartTime: new Date(),
      role: "USER",
    },
  });
  console.log("Savior account created:", savior);

  // Link the savior to the QR code
  const saviorQRCode = await prisma.saviorQRCode.create({
    data: {
      saviorId: savior.id,
      qrCodeId: qrCode.id,
    },
  });
  console.log("Savior QR Code linked:", saviorQRCode);

  // Add an accident photo to the QR code
  const accidentPhoto = await prisma.accidentPhoto.create({
    data: {
      qrCodeId: qrCode.id,
      photoUrl:
        "https://res.cloudinary.com/doekljkgd/image/upload/v1737304837/accidents/sample_photo.png",
    },
  });
  console.log("Accident photo created:", accidentPhoto);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
