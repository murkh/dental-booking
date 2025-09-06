import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

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
    scheduledAt: z.string(),
    notes: z.string().optional(),
  }),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createAppointmentSchema.parse(body)

    // Check if patient already exists
    let patient = await prisma.patient.findUnique({
      where: { email: validatedData.patient.email }
    })

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
        }
      })
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        doctorId: validatedData.appointment.doctorId,
        appointmentTypeId: validatedData.appointment.appointmentTypeId,
        scheduledAt: new Date(validatedData.appointment.scheduledAt),
        notes: validatedData.appointment.notes,
        status: 'SCHEDULED',
      },
      include: {
        patient: true,
        doctor: true,
        appointmentType: true,
      }
    })

    // Mark time slot as booked
    const scheduledDate = new Date(validatedData.appointment.scheduledAt)
    const timeString = scheduledDate.toTimeString().slice(0, 5) // HH:MM format

    await prisma.timeSlot.updateMany({
      where: {
        doctorId: validatedData.appointment.doctorId,
        date: {
          gte: new Date(scheduledDate.getFullYear(), scheduledDate.getMonth(), scheduledDate.getDate()),
          lt: new Date(scheduledDate.getFullYear(), scheduledDate.getMonth(), scheduledDate.getDate() + 1),
        },
        startTime: timeString,
      },
      data: {
        isBooked: true,
      }
    })

    return NextResponse.json(appointment, { status: 201 })
  } catch (error) {
    console.error('Error creating appointment:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const patientEmail = searchParams.get('patientEmail')

    if (!patientEmail) {
      return NextResponse.json(
        { error: 'Patient email is required' },
        { status: 400 }
      )
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        patient: {
          email: patientEmail
        }
      },
      include: {
        patient: true,
        doctor: true,
        appointmentType: true,
      },
      orderBy: {
        scheduledAt: 'desc'
      }
    })

    return NextResponse.json(appointments)
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    )
  }
}
