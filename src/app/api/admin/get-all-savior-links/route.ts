import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Ensure Prisma is correctly configured
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export const dynamic = "force-dynamic"; // Forces the route to be dynamic and prevents caching

export async function GET(req: NextRequest) {
  // Only pass `NextRequest`
  // console.log("Request Method:", req.method);
  if (req.method !== "GET") {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
  }

  // Fetch session using the correct method
  const session = await getServerSession(authOptions); // Use getServerSession without req

  // Check if the user is authenticated and has an admin role
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json(
      {
        error: "Access denied. Admins only.",
      },
      { status: 403 }
    );
  }

  try {
    // Fetch all QR codes and linked saviors
    const qrCodes = await prisma.qRCode.findMany({
      include: {
        saviors: true, // Include linked saviors
      },
    });

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
        { error: "No saviors found for the QR codes." },
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

    return NextResponse.json(result); // Return the response using NextResponse
  } catch (error: any) {
    console.error("Error fetching savior data:", error);
    return NextResponse.json(
      {
        error: "An error occurred while fetching savior data.",
      },
      { status: 500 }
    );
  }
}
