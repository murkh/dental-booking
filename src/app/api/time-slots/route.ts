import { type NextRequest, NextResponse } from "next/server";
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

    const date_form = new Date(date);
    const currDate = new Date(
      Date.UTC(
        date_form.getUTCFullYear(),
        date_form.getUTCMonth(),
        date_form.getUTCDate()
      )
    );

    const schedule = await prisma.schedule.findFirst({
      where: {
        doctorId: doctorId,
        date: currDate,
      },
    });

    console.log(schedule);

    if (!schedule) {
      return NextResponse.json({ slots: [] });
    }

    const slots = await prisma.slot.findMany({
      where: {
        scheduleId: schedule.id,
        isBooked: false,
      },
    });

    console.log(slots);

    return NextResponse.json({ slots });
  } catch (error) {
    console.error("Error fetching time slots:", error);
    return NextResponse.json(
      { error: "Failed to fetch time slots" },
      { status: 500 }
    );
  }
}
