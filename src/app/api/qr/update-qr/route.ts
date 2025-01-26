import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import QRCode from "qrcode";
import cloudinary from "@/utils/cloudinary"; // Assuming Cloudinary utility is correctly set up

export const dynamic = "force-dynamic"; // Forces the route to be dynamic and prevents caching

export async function POST(request: NextRequest) {
  try {
    // Get qrId from query params
    const qrId = request.nextUrl.searchParams.get("qrId");

    if (!qrId) {
      return NextResponse.json(
        { error: "QR code id is required" },
        { status: 400 }
      );
    }

    // Parse the JSON body for QR code details
    const {
      victimName,
      victimEmail,
      relativeName,
      relativePhone,
      relativeEmail,
      bloodGroup,
      sickness,
      medication,
      reqStatus,
      qrStatus,
    } = await request.json(); // Get the QR code details

    // Fetch the existing QR code from the database
    const existingQRCode = await prisma.qRCode.findUnique({
      where: { id: qrId },
    });

    if (!existingQRCode) {
      return NextResponse.json({ error: "QR code not found" }, { status: 404 });
    }

    //update the fields without re-generating the QR code
    const updatedQRCode = await prisma.qRCode.update({
      where: { id: qrId },
      data: {
        victimName,
        victimEmail,
        relativeName,
        relativePhone,
        relativeEmail,
        bloodGroup,
        sickness,
        medication,
        status: qrStatus || existingQRCode.status, // Keep existing status if not provided
      },
    });

    return NextResponse.json({
      message: "QR code updated successfully.",
      data: updatedQRCode,
    });
  } catch (error: any) {
    console.error("Error updating QR code:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
