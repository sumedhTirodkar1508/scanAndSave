import nodemailer from "nodemailer";

export const sendAdminNotification = async (qrCode: any) => {
  try {
    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: process.env.ADMIN_EMAIL, // Admin's email
      subject: "New QR Code Creation Request",
      text: `A new QR code creation request has been submitted by user ${
        qrCode.victimName
      }. The details are as follows:
      
      Victim: ${qrCode.victimName} (${qrCode.victimEmail})
      Relative: ${qrCode.relativeName} (${qrCode.relativePhone}, ${
        qrCode.relativeEmail
      })
      Blood Group: ${qrCode.bloodGroup}
      Sickness: ${qrCode.sickness || "N/A"}
      Medication: ${qrCode.medication || "N/A"}

      Please review and approve or reject the request.`,
    };

    const mailresponse = await transport.sendMail(mailOptions);
    return mailresponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
