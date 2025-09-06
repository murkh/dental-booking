import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const doctorId = searchParams.get('doctorId')
    const date = searchParams.get('date')

    if (!doctorId || !date) {
      return NextResponse.json(
        { error: 'Doctor ID and date are required' },
        { status: 400 }
      )
    }

    const requestedDate = new Date(date)
    const startOfDay = new Date(requestedDate)
    startOfDay.setHours(0, 0, 0, 0)
    
    const endOfDay = new Date(requestedDate)
    endOfDay.setHours(23, 59, 59, 999)

    const timeSlots = await prisma.timeSlot.findMany({
      where: {
        doctorId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        }
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        isBooked: true,
      },
      orderBy: {
        startTime: 'asc'
      }
    })

    return NextResponse.json(timeSlots)
  } catch (error) {
    console.error('Error fetching time slots:', error)
    return NextResponse.json(
      { error: 'Failed to fetch time slots' },
      { status: 500 }
    )
  }
}
