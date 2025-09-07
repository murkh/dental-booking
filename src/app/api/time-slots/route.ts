import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get("doctorId");
    const date = searchParams.get("date");

    if (!doctorId || !date) {
      return NextResponse.json(
        { error: "Doctor ID and date are required" },
        { status: 400 }
      );
    }

    const requestedDate = new Date(date);
    // Create a date at midnight for the requested date to match how it's stored in the database
    const targetDate = new Date(
      requestedDate.getFullYear(),
      requestedDate.getMonth(),
      requestedDate.getDate()
    );

    console.log("API Request:", { doctorId, date, requestedDate, targetDate });

    const timeSlots = await prisma.timeSlot.findMany({
      where: {
        doctorId,
        date: targetDate,
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        isBooked: true,
      },
      orderBy: {
        startTime: "asc",
      },
    });

    console.log("Found time slots:", timeSlots.length);
    console.dir(timeSlots, { depth: null });

    // If no time slots found, let's check what's in the database
    if (timeSlots.length === 0) {
      const allTimeSlots = await prisma.timeSlot.findMany({
        where: { doctorId },
        select: {
          id: true,
          date: true,
          startTime: true,
          endTime: true,
          isBooked: true,
        },
        take: 5, // Just get a few examples
      });
      console.log("All time slots for this doctor:", allTimeSlots);
    }

    return NextResponse.json(timeSlots);
  } catch (error) {
    console.error("Error fetching time slots:", error);
    return NextResponse.json(
      { error: "Failed to fetch time slots" },
      { status: 500 }
    );
  }
}
