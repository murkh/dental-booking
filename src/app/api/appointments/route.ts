import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const createAppointmentSchema = z.object({
  patient: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
    dateOfBirth: z.string(),
    sex: z.string(),
    medicalInfo: z.string().optional(),
    isExisting: z.boolean(),
  }),
  appointment: z.object({
    doctorId: z.string(),
    appointmentTypeId: z.string(),
    slotId: z.string(),
    notes: z.string().optional(),
  }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createAppointmentSchema.parse(body);

    // Check if patient already exists
    let patient = await prisma.patient.findUnique({
      where: { email: validatedData.patient.email },
    });

    // Create patient if they don't exist
    if (!patient) {
      patient = await prisma.patient.create({
        data: {
          firstName: validatedData.patient.firstName,
          lastName: validatedData.patient.lastName,
          email: validatedData.patient.email,
          phone: validatedData.patient.phone,
          dateOfBirth: new Date(validatedData.patient.dateOfBirth),
          sex: validatedData.patient.sex,
          medicalInfo: validatedData.patient.medicalInfo,
          isExisting: validatedData.patient.isExisting,
        },
      });
    }

    const slot = await prisma.slot.findUnique({
      where: { id: validatedData.appointment.slotId },
      include: { schedule: true },
    });

    if (!slot) {
      return NextResponse.json({ error: "Invalid slot" }, { status: 400 });
    }

    if (slot.isBooked) {
      return NextResponse.json(
        { error: "Slot is already booked" },
        { status: 400 },
      );
    }

    const scheduledAt = new Date(slot.schedule.date);
    const [hours, minutes] = slot.startTime.split(":").map(Number);
    scheduledAt.setHours(hours);
    scheduledAt.setMinutes(minutes);

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        doctorId: validatedData.appointment.doctorId,
        appointmentTypeId: validatedData.appointment.appointmentTypeId,
        scheduledAt,
        notes: validatedData.appointment.notes,
        status: "SCHEDULED",
        slotId: validatedData.appointment.slotId,
      },
      include: {
        patient: true,
        doctor: true,
        appointmentType: true,
      },
    });

    // Mark time slot as booked
    await prisma.slot.update({
      where: {
        id: validatedData.appointment.slotId,
      },
      data: {
        isBooked: true,
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error("Error creating appointment:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const patientEmail = searchParams.get("patientEmail");

    if (!patientEmail) {
      return NextResponse.json(
        { error: "Patient email is required" },
        { status: 400 },
      );
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        patient: {
          email: patientEmail,
        },
      },
      include: {
        patient: true,
        doctor: true,
        appointmentType: true,
      },
      orderBy: {
        scheduledAt: "desc",
      },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 },
    );
  }
}
