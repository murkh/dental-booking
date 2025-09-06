import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create appointment types
  const appointmentTypes = await Promise.all([
    prisma.appointmentType.create({
      data: {
        name: 'General Checkup',
        description: 'Routine dental examination',
        duration: 30,
        price: 80.00,
      }
    }),
    prisma.appointmentType.create({
      data: {
        name: 'Teeth Cleaning',
        description: 'Professional teeth cleaning',
        duration: 45,
        price: 120.00,
      }
    }),
    prisma.appointmentType.create({
      data: {
        name: 'Filling',
        description: 'Dental filling procedure',
        duration: 60,
        price: 150.00,
      }
    }),
    prisma.appointmentType.create({
      data: {
        name: 'Root Canal',
        description: 'Root canal treatment',
        duration: 90,
        price: 400.00,
      }
    }),
    prisma.appointmentType.create({
      data: {
        name: 'Extraction',
        description: 'Tooth extraction',
        duration: 45,
        price: 180.00,
      }
    }),
    prisma.appointmentType.create({
      data: {
        name: 'Crown',
        description: 'Dental crown placement',
        duration: 120,
        price: 500.00,
      }
    }),
    prisma.appointmentType.create({
      data: {
        name: 'Emergency',
        description: 'Emergency dental care',
        duration: 30,
        price: 200.00,
      }
    }),
  ])

  // Create doctors
  const doctors = await Promise.all([
    prisma.doctor.create({
      data: {
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@dentalcarecentreuk.co.uk',
        phone: '0207 639 3323',
        specialties: ['General Dentistry', 'Preventive Care'],
      }
    }),
    prisma.doctor.create({
      data: {
        firstName: 'Michael',
        lastName: 'Chen',
        email: 'michael.chen@dentalcarecentreuk.co.uk',
        phone: '0207 639 3324',
        specialties: ['Orthodontics', 'Cosmetic Dentistry'],
      }
    }),
    prisma.doctor.create({
      data: {
        firstName: 'Emily',
        lastName: 'Davis',
        email: 'emily.davis@dentalcarecentreuk.co.uk',
        phone: '0207 639 3325',
        specialties: ['Oral Surgery', 'Implantology'],
      }
    }),
    prisma.doctor.create({
      data: {
        firstName: 'James',
        lastName: 'Wilson',
        email: 'james.wilson@dentalcarecentreuk.co.uk',
        phone: '0207 639 3326',
        specialties: ['Periodontics', 'Gum Treatment'],
      }
    }),
  ])

  // Generate time slots for the next 30 days
  const today = new Date()
  const timeSlots = []

  for (let day = 0; day < 30; day++) {
    const date = new Date(today)
    date.setDate(today.getDate() + day)
    
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue

    for (const doctor of doctors) {
      // Generate time slots from 9 AM to 5 PM with 40-minute intervals
      for (let hour = 9; hour < 17; hour++) {
        for (let minutes = 0; minutes < 60; minutes += 40) {
          if (hour === 16 && minutes > 0) break // Don't go past 5 PM
          
          const startTime = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
          const endMinutes = minutes + 40
          const endHour = endMinutes >= 60 ? hour + 1 : hour
          const endTimeMinutes = endMinutes >= 60 ? endMinutes - 60 : endMinutes
          const endTime = `${endHour.toString().padStart(2, '0')}:${endTimeMinutes.toString().padStart(2, '0')}`

          timeSlots.push({
            doctorId: doctor.id,
            date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
            startTime,
            endTime,
            isBooked: Math.random() < 0.2, // 20% chance of being booked
          })
        }
      }
    }
  }

  // Create time slots in batches
  const batchSize = 100
  for (let i = 0; i < timeSlots.length; i += batchSize) {
    const batch = timeSlots.slice(i, i + batchSize)
    await prisma.timeSlot.createMany({
      data: batch,
      skipDuplicates: true,
    })
  }

  console.log('Database seeded successfully!')
  console.log(`Created ${appointmentTypes.length} appointment types`)
  console.log(`Created ${doctors.length} doctors`)
  console.log(`Created ${timeSlots.length} time slots`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
