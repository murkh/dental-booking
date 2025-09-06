"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AppointmentDetailsForm } from "@/components/appointment-details-form"
import { PersonalDetailsForm } from "@/components/personal-details-form"
import { TimeSlotSelection } from "@/components/time-slot-selection"
import { AppointmentDetailsFormData, PersonalDetailsFormData } from "@/lib/validations"

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1)
  const [appointmentData, setAppointmentData] = useState<AppointmentDetailsFormData | null>(null)
  const [personalData, setPersonalData] = useState<PersonalDetailsFormData | null>(null)
  const [selectedTime, setSelectedTime] = useState<string>("")

  const handleAppointmentDetailsNext = (data: AppointmentDetailsFormData) => {
    setAppointmentData(data)
    setCurrentStep(2)
  }

  const handlePersonalDetailsNext = (data: PersonalDetailsFormData) => {
    setPersonalData(data)
    setCurrentStep(3)
  }

  const handleTimeSlotNext = (time: string) => {
    setSelectedTime(time)
    // Here you would typically submit the complete booking
    console.log("Complete booking data:", {
      appointmentData,
      personalData,
      selectedTime
    })
    // For now, we'll just show a success message
    alert("Appointment booked successfully!")
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <AppointmentDetailsForm onNext={handleAppointmentDetailsNext} />
      case 2:
        return <PersonalDetailsForm onNext={handlePersonalDetailsNext} onBack={handleBack} />
      case 3:
        return (
          <TimeSlotSelection
            onNext={handleTimeSlotNext}
            onBack={handleBack}
            doctorId={appointmentData?.doctorId || ""}
            selectedDate={new Date()}
          />
        )
      default:
        return <AppointmentDetailsForm onNext={handleAppointmentDetailsNext} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentStep={currentStep} />
      
      <main className="py-12">
        {renderCurrentStep()}
      </main>
      
      <Footer />
    </div>
  )
}