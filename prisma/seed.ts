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
      victimName: "Jane",
      victimSurname: "Doe",
      victimEmail: "jane.doe@example.com",
      victimHeight: "5.6",
      victimWeight: "60.5",
      victimAge: "30",
      victimProfession: "Software Engineer",
      victimNationality: "American",
      victimTelNumber: "9876543210",
      victimHouseNumber: "123A",
      victimAddress: "123 Elm Street",
      victimCity: "New York",
      victimCountry: "USA",
      relative1Name: "Sarah",
      relative1Surname: "Doe",
      relative1Address: "456 Oak Street",
      relative1Phone: "1234567890",
      relative1Email: "sarah.doe@example.com",
      relative2Name: "Michael",
      relative2Surname: "Doe",
      relative2Address: "789 Pine Street",
      relative2Phone: "2345678901",
      relative2Email: "michael.doe@example.com",
      relative3Name: "Emily",
      relative3Surname: "Doe",
      relative3Address: "101 Maple Avenue",
      relative3Phone: "3456789012",
      relative3Email: "emily.doe@example.com",
      bloodGroup: "O+",
      onDrugs: false,
      drugsName: null,
      doctorPhoneNumber: "5678901234",
      sickness: "Asthma",
      medication: "Inhaler",
      hospitalName: "NY General Hospital",
      status: "PENDING",
      qrCodeUrl:
        "https://res.cloudinary.com/doekljkgd/image/upload/v1737304837/qrcodes/sample.png",
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

  // Create an email verification token for the user
  const emailVerificationToken = await prisma.emailVerificationToken.create({
    data: {
      userId: user.id,
      emailVerifyToken: "sample-token-123",
      expires: new Date(Date.now() + 3600 * 1000), // Expires in 1 hour
    },
  });
  console.log("Email verification token created:", emailVerificationToken);
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
