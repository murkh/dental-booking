import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const appointmentTypes = await prisma.appointmentType.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        duration: true,
        price: true,
      },
    });

    return NextResponse.json(appointmentTypes);
  } catch (error) {
    console.error("Error fetching appointment types:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointment types" },
      { status: 500 },
    );
  }
}
