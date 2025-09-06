"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { appointmentDetailsSchema, type AppointmentDetailsFormData } from "@/lib/validations"

interface AppointmentDetailsFormProps {
  onNext: (data: AppointmentDetailsFormData) => void
}

const appointmentTypes = [
  { id: "1", name: "General Checkup", description: "Routine dental examination" },
  { id: "2", name: "Teeth Cleaning", description: "Professional teeth cleaning" },
  { id: "3", name: "Filling", description: "Dental filling procedure" },
  { id: "4", name: "Root Canal", description: "Root canal treatment" },
  { id: "5", name: "Extraction", description: "Tooth extraction" },
  { id: "6", name: "Crown", description: "Dental crown placement" },
  { id: "7", name: "Emergency", description: "Emergency dental care" },
]

const doctors = [
  { id: "1", name: "Dr. Sarah Johnson", specialty: "General Dentistry" },
  { id: "2", name: "Dr. Michael Chen", specialty: "Orthodontics" },
  { id: "3", name: "Dr. Emily Davis", specialty: "Oral Surgery" },
  { id: "4", name: "Dr. James Wilson", specialty: "Periodontics" },
]

export function AppointmentDetailsForm({ onNext }: AppointmentDetailsFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid }
  } = useForm<AppointmentDetailsFormData>({
    resolver: zodResolver(appointmentDetailsSchema),
    mode: 'onChange'
  })

  const isExisting = watch('isExisting')
  const appointmentType = watch('appointmentType')
  const doctorId = watch('doctorId')

  const onSubmit = (data: AppointmentDetailsFormData) => {
    onNext(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-8">
      <div className="space-y-8">
        {/* Existing Patient Question */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Have you booked an appointment with us before?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              type="button"
              variant={isExisting === true ? "purple" : "grey"}
              size="lg"
              className="h-16 lg:h-20 flex flex-col items-center justify-center space-y-1"
              onClick={() => setValue('isExisting', true)}
            >
              <span className="text-base lg:text-lg font-semibold">Yes</span>
              <span className="text-xs lg:text-sm opacity-90">I'm an existing patient</span>
            </Button>
            <Button
              type="button"
              variant={isExisting === false ? "purple" : "grey"}
              size="lg"
              className="h-16 lg:h-20 flex flex-col items-center justify-center space-y-1"
              onClick={() => setValue('isExisting', false)}
            >
              <span className="text-base lg:text-lg font-semibold">No</span>
              <span className="text-xs lg:text-sm opacity-90">I'm a new patient</span>
            </Button>
          </div>
          {errors.isExisting && (
            <p className="text-red-500 text-sm mt-2">{errors.isExisting.message}</p>
          )}
        </div>

        {/* Appointment Type */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            What can we help you with?
          </h3>
          <Select value={appointmentType} onValueChange={(value) => setValue('appointmentType', value)}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select reason..." />
            </SelectTrigger>
            <SelectContent>
              {appointmentTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  <div>
                    <div className="font-medium">{type.name}</div>
                    <div className="text-sm text-gray-500">{type.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.appointmentType && (
            <p className="text-red-500 text-sm mt-2">{errors.appointmentType.message}</p>
          )}
        </div>

        {/* Doctor Selection */}
        <div>
          <h3 className={`text-lg font-semibold mb-4 ${
            appointmentType ? 'text-gray-900' : 'text-gray-400'
          }`}>
            Who would you like to see?
          </h3>
          <Select 
            value={doctorId} 
            onValueChange={(value) => setValue('doctorId', value)}
            disabled={!appointmentType}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Choose your provider" />
            </SelectTrigger>
            <SelectContent>
              {doctors.map((doctor) => (
                <SelectItem key={doctor.id} value={doctor.id}>
                  <div>
                    <div className="font-medium">{doctor.name}</div>
                    <div className="text-sm text-gray-500">{doctor.specialty}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.doctorId && (
            <p className="text-red-500 text-sm mt-2">{errors.doctorId.message}</p>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Button
          type="submit"
          variant="purple"
          size="xl"
          disabled={!isValid}
        >
          NEXT: PERSONAL DETAILS
        </Button>
      </div>
    </form>
  )
}
