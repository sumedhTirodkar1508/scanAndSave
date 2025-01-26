import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASSWORD,
  },
});

export const notifyRelatives = async (
  qrCode: any,
  saviorEmail: string,
  scanTime: Date
) => {
  try {
    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: qrCode.relativeEmail,
      //   cc: qrCode.additionalRelativeEmails, // Assuming you have this field
      subject: "QR Code Scanned - Victim Information Accessed",
      text: `Your relative's (${qrCode.victimName}) QR code has been scanned.
      
      Scanned by: ${saviorEmail}
      Scan Time: ${scanTime.toLocaleString()}
      
      If you don't recognize this activity, please contact us immediately.`,
    };

    const mailresponse = await transport.sendMail(mailOptions);
    return mailresponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const informSavior = async (qrCode: any, saviorEmail: string) => {
  try {
    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: saviorEmail,
      subject: "Victim Information - Emergency Contact Details",
      text: `Thank you for scanning the QR code. Here are the emergency contact details:
      
      Victim Name: ${qrCode.victimName}
      Relative Name: ${qrCode.relativeName}
      Relative Phone: ${qrCode.relativePhone}
      Relative Email: ${qrCode.relativeEmail}
      
      Please use this information responsibly and only for emergency purposes.`,
    };

    const mailresponse = await transport.sendMail(mailOptions);
    return mailresponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
