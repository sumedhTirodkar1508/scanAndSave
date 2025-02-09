import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto"; // Use to generate
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/mailer";

export const dynamic = "force-dynamic"; // Prevent caching

export async function POST(request: NextRequest) {
  try {
    // Authenticate user session
    const session = await getServerSession(authOptions);

    // Ensure the user is an ADMIN
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Access denied. Admins only." },
        { status: 403 }
      );
    }

    // Parse request body
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      console.error("Validation Error: Missing required fields.", {
        name,
        email,
        password,
      });
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      console.error("User already exists:", email);
      return NextResponse.json(
        { message: "User already exists." },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully.");

    // Create new hospital user with role DOC
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "DOC", // Ensure this value is correctly defined in Prisma
        isTemporary: false,
      },
    });

    if (!newUser) {
      console.error("Failed to create user.");
      throw new Error("Failed to create user.");
    }

    // Generate a unique verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 48 * 60 * 60 * 1000); // Token valid for 24 hours

    await prisma.emailVerificationToken.create({
      data: {
        userId: newUser.id,
        emailVerifyToken: verificationToken,
        expires,
      },
    });

    // Send the verification email
    await sendVerificationEmail(email, verificationToken);

    console.log("Hospital user created successfully:", newUser);

    return NextResponse.json({
      message: "Hospital user created successfully.",
      user: newUser,
    });
  } catch (error: any) {
    console.error("Error creating hospital user:", error?.message || error); // Safer logging
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
