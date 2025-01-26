import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    let reqBody;
    try {
      reqBody = await request.json();
    } catch (error) {
      console.error("Error parsing JSON request body:", error);
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { qrCodeId, userId } = reqBody || {};
    if (!qrCodeId) {
      return NextResponse.json(
        { error: "QR Code ID is required" },
        { status: 400 }
      );
    }

    const qrCode = await prisma.qRCode.findUnique({
      where: { id: qrCodeId },
    });

    if (!qrCode) {
      console.error(`Invalid QR Code ID: ${qrCodeId}`);
      return NextResponse.json(
        { error: "Invalid QR Code ID" },
        { status: 400 }
      );
    }

    try {
      // Check if the entry already exists
      const existingEntry = await prisma.saviorQRCode.findFirst({
        where: {
          AND: [{ saviorId: userId }, { qrCodeId: qrCodeId }],
        },
      });

      if (existingEntry) {
        console.log("Entry already exists:", existingEntry);
        return NextResponse.json(
          {
            message: "QR Code already linked to this user",
            data: existingEntry,
          },
          { status: 200 }
        );
      }

      // If no existing entry, create a new one
      const newEntry = await prisma.saviorQRCode.create({
        data: {
          saviorId: userId,
          qrCodeId,
        },
      });

      return NextResponse.json(
        { message: "QR Code linked successfully", data: newEntry },
        { status: 201 }
      );
    } catch (createError) {
      console.error("Error creating saviorQRCode entry:", createError);
      return NextResponse.json(
        { error: "Failed to link QR Code to the user" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Unexpected error occurred:", error);
    return NextResponse.json(
      { error: "An error occurred while linking the QR Code" },
      { status: 500 }
    );
  }
}
