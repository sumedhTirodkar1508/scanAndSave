import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Fetch all users with role DOC
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: { role: "DOC" },
      select: { id: true, name: true, email: true },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// Update user details
export async function PUT(req: Request) {
  try {
    const { id, name, email } = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, email },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// Delete user
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
