// THIS REQUEST WILL SAVE DATA TO DB AS WELL AS NOTIFY THE ADMIN USER
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendAdminNotification } from "@/helpers/notifyAdmin";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const {
      userId,
      victimName,
      victimEmail,
      relativeName,
      relativePhone,
      relativeEmail,
      bloodGroup,
      sickness,
      medication,
      status,
    } = reqBody;

    // Save the QR code details to the database
    const qrCode = await prisma.qRCode.create({
      data: {
        userId,
        victimName,
        victimEmail,
        relativeName,
        relativePhone,
        relativeEmail,
        bloodGroup,
        sickness,
        medication,
        status, // Always 'PENDING'
      },
    });

    // Notify the admin (custom notification logic)
    await sendAdminNotification(qrCode); // Helper function to send notification

    return NextResponse.json({
      message: "QR code created successfully!",
      success: true,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
