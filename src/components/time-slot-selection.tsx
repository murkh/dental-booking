"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { formatTime } from "@/lib/utils"

interface TimeSlotSelectionProps {
  onNext: (selectedTime: string) => void
  onBack: () => void
  doctorId: string
  selectedDate: Date
}

// Mock time slots - in a real app, these would come from the API
const generateTimeSlots = (date: Date) => {
  const slots = []
  const startHour = 9
  const endHour = 17
  const interval = 40 // 40 minutes between appointments

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minutes = 0; minutes < 60; minutes += interval) {
      if (hour === endHour - 1 && minutes > 0) break // Don't go past 5 PM
      
      const timeString = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
      const isAvailable = Math.random() > 0.3 // 70% chance of being available
      
      slots.push({
        time: timeString,
        isAvailable,
        isBooked: !isAvailable
      })
    }
  }

  return slots
}

export function TimeSlotSelection({ onNext, onBack, doctorId, selectedDate }: TimeSlotSelectionProps) {
  const [selectedTime, setSelectedTime] = useState<string>("")
  const timeSlots = generateTimeSlots(selectedDate)

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const handleSubmit = () => {
    if (selectedTime) {
      onNext(selectedTime)
    }
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-8">
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Select Your Preferred Time
          </h3>
          <p className="text-gray-600">
            Available time slots for {selectedDate.toLocaleDateString('en-GB', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        {/* Time Slots Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {timeSlots.map((slot) => (
            <Button
              key={slot.time}
              variant={selectedTime === slot.time ? "purple" : slot.isAvailable ? "outline" : "grey"}
              size="lg"
              className="h-12"
              onClick={() => slot.isAvailable && handleTimeSelect(slot.time)}
              disabled={!slot.isAvailable}
            >
              {formatTime(slot.time)}
            </Button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border border-gray-300 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-purple-600 rounded"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-300 rounded"></div>
            <span>Unavailable</span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Button
          variant="purple"
          size="xl"
          onClick={handleSubmit}
          disabled={!selectedTime}
        >
          NEXT: PERSONAL DETAILS
        </Button>
      </div>
    </div>
  )
}
