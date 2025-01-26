import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Ensure Prisma is configured correctly

export const dynamic = "force-dynamic"; // Forces the route to be dynamic and prevents caching

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const saviorId = searchParams.get("userId");

  if (!saviorId) {
    return NextResponse.json(
      { error: "Savior ID is required." },
      { status: 400 }
    );
  }

  try {
    // Fetch scanned QR codes for the logged-in user
    const scannedQRCodes = await prisma.saviorQRCode.findMany({
      where: { saviorId: saviorId },
      include: {
        qrCode: true, // Include related QRCode details
      },
    });

    if (!scannedQRCodes || scannedQRCodes.length === 0) {
      return NextResponse.json(
        { error: "No scanned QR codes found for this user." },
        { status: 404 }
      );
    }
    // console.log("Scanned QR codes:", scannedQRCodes);
    return NextResponse.json(scannedQRCodes);
  } catch (error: any) {
    console.error("Error fetching scanned QR codes:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching scanned QR codes." },
      { status: 500 }
    );
  }
}
