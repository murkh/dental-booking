import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get("doctorId");

    if (!doctorId) {
      return NextResponse.json(
        { error: "Doctor ID is required" },
        { status: 400 },
      );
    }

    // Get all time slots for this doctor
    const allTimeSlots = await prisma.timeSlot.findMany({
      where: { doctorId },
      select: {
        id: true,
        date: true,
        startTime: true,
        endTime: true,
        isBooked: true,
      },
      orderBy: {
        date: "asc",
      },
      take: 20, // Limit to first 20 for debugging
    });

    // Get count of total time slots
    const totalCount = await prisma.timeSlot.count({
      where: { doctorId },
    });

    // Get unique dates
    const uniqueDates = await prisma.timeSlot.findMany({
      where: { doctorId },
      select: {
        date: true,
      },
      distinct: ["date"],
      orderBy: {
        date: "asc",
      },
    });

    return NextResponse.json({
      doctorId,
      totalCount,
      uniqueDates: uniqueDates.map((d) => d.date),
      sampleTimeSlots: allTimeSlots,
    });
  } catch (error) {
    console.error("Error in debug endpoint:", error);
    return NextResponse.json(
      { error: "Failed to fetch debug info" },
      { status: 500 },
    );
  }
}
