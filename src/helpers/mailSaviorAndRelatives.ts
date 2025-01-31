import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASSWORD,
  },
});

// Validate email format using regex
const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const notifyRelatives = async (
  qrCode: any,
  saviorEmail: string,
  scanTime: Date
) => {
  try {
    // Validate emails and remove empty values
    const primaryRecipient = isValidEmail(qrCode.relative1Email?.trim())
      ? qrCode.relative1Email.trim()
      : null;
    const ccRecipients = [
      qrCode.relative2Email?.trim(),
      qrCode.relative3Email?.trim(),
    ]
      .filter((email) => email && isValidEmail(email)) // Filter invalid emails
      .join(", "); // Convert to a comma-separated string

    // If no valid primary recipient, exit early
    if (!primaryRecipient) {
      console.log("No valid primary recipient found. Skipping email sending.");
      return;
    }
    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: primaryRecipient, // First relative gets the main email
      cc: ccRecipients || undefined, // CC other relatives if available
      subject: "QR Code Scanned - Victim Information Accessed",
      text: `Your relative's (${qrCode.victimName}) QR code has been scanned.
      
      Scanned by: ${saviorEmail}
      Scan Time: ${scanTime.toLocaleString("fr-TG")}
      
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
      Relative Name: ${qrCode.relative1Name}
      Relative Phone: ${qrCode.relative1Phone}
      Relative Email: ${qrCode.relative1Email}

      Relative Name: ${qrCode.relative2Name}
      Relative Phone: ${qrCode.relative2Phone}
      Relative Email: ${qrCode.relative2Email}

      Relative Name: ${qrCode.relative3Name}
      Relative Phone: ${qrCode.relative3Phone}
      Relative Email: ${qrCode.relative3Email}
      
      Please use this information responsibly and only for emergency purposes.`,
    };

    const mailresponse = await transport.sendMail(mailOptions);
    return mailresponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
