import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Ensure Prisma is correctly configured

export const dynamic = "force-dynamic"; // Forces the route to be dynamic and prevents caching

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userIdFromSession = searchParams.get("userId");

  if (!userIdFromSession) {
    return NextResponse.json(
      { error: "User ID is required from session." },
      { status: 400 }
    );
  }

  try {
    // Fetch QR codes linked to the user from the QRCode model
    const qrCodes = await prisma.qRCode.findMany({
      where: { userId: userIdFromSession as string }, // Check userId from session
      include: {
        saviors: true, // Include linked saviors (saviorQRCode model)
      },
    });

    // console.log("QR codes:", qrCodes);
    if (!qrCodes || qrCodes.length === 0) {
      return NextResponse.json(
        { error: "No QR codes found for the provided user ID." },
        { status: 404 }
      );
    }

    // Prepare a mapping of saviorId to their respective QR code
    const saviorQRCodeMap = qrCodes.flatMap((qrCode) =>
      qrCode.saviors.map((savior) => ({
        saviorId: savior.saviorId,
        qrCode: {
          victimName: qrCode.victimName,
          victimEmail: qrCode.victimEmail,
        },
      }))
    );

    // Extract unique savior IDs
    const saviorIds = Array.from(
      new Set(saviorQRCodeMap.map((entry) => entry.saviorId))
    );

    if (saviorIds.length === 0) {
      return NextResponse.json(
        {
          error: "No saviors found for the QR codes associated with this user.",
        },
        { status: 404 }
      );
    }

    // Fetch savior user details using the saviorIds
    const saviors = await prisma.user.findMany({
      where: {
        id: { in: saviorIds },
      },
      select: {
        id: true,
        name: true,
        email: true,
        profileImageUrl: true,
        createdAt: true,
      },
    });

    // Map QR code data to each savior
    const result = saviors.map((savior) => {
      const qrCodeData = saviorQRCodeMap.find(
        (entry) => entry.saviorId === savior.id
      )?.qrCode;

      return {
        ...savior,
        qrCode: qrCodeData || null, // Include QR code data if available
      };
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error fetching savior data:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching savior data." },
      { status: 500 }
    );
  }
}
