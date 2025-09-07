"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  appointmentDetailsSchema,
  type AppointmentDetailsFormData,
} from "@/lib/validations";
import { useDoctors, useAppointmentTypes, useTimeSlots } from "@/hooks/use-api";
import { formatTime } from "@/lib/utils";

interface AppointmentDetailsFormProps {
  onNext: (data: AppointmentDetailsFormData & { selectedTime: string }) => void;
}

export function AppointmentDetailsForm({
  onNext,
}: AppointmentDetailsFormProps) {
  const { doctors, loading: doctorsLoading } = useDoctors();
  const { appointmentTypes, loading: typesLoading } = useAppointmentTypes();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<AppointmentDetailsFormData>({
    resolver: zodResolver(appointmentDetailsSchema),
    mode: "onChange",
  });

  const isExisting = watch("isExisting");
  const appointmentType = watch("appointmentType");
  const doctorId = watch("doctorId");
  const [selectedTime, setSelectedTime] = useState<string>("");

  // Memoize the date to prevent unnecessary API calls
  const selectedDate = useMemo(() => new Date(), []);

  // Only fetch time slots when doctor is selected and appointment type is chosen
  const shouldFetchTimeSlots = doctorId && appointmentType;
  const { timeSlots, loading: timeSlotsLoading } = useTimeSlots(
    shouldFetchTimeSlots ? doctorId : "",
    selectedDate
  );

  // Auto-progress when all fields are filled including time selection
  useEffect(() => {
    if (
      isExisting !== undefined &&
      appointmentType &&
      doctorId &&
      selectedTime
    ) {
      const timer = setTimeout(() => {
        onNext({
          isExisting: isExisting as boolean,
          appointmentType,
          doctorId,
          selectedTime,
        });
      }, 500); // Small delay for better UX

      return () => clearTimeout(timer);
    }
  }, [isExisting, appointmentType, doctorId, selectedTime, onNext]);

  const onSubmit = (data: AppointmentDetailsFormData) => {
    onNext({
      ...data,
      selectedTime,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-8"
    >
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
              onClick={() => setValue("isExisting", true)}
            >
              <span className="text-base lg:text-lg font-semibold">Yes</span>
              <span className="text-xs lg:text-sm opacity-90">
                I'm an existing patient
              </span>
            </Button>
            <Button
              type="button"
              variant={isExisting === false ? "purple" : "grey"}
              size="lg"
              className="h-16 lg:h-20 flex flex-col items-center justify-center space-y-1"
              onClick={() => setValue("isExisting", false)}
            >
              <span className="text-base lg:text-lg font-semibold">No</span>
              <span className="text-xs lg:text-sm opacity-90">
                I'm a new patient
              </span>
            </Button>
          </div>
          {errors.isExisting && (
            <p className="text-red-500 text-sm mt-2">
              {errors.isExisting.message}
            </p>
          )}
        </div>

        {/* Appointment Type */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            What can we help you with?
          </h3>
          <Select
            value={appointmentType}
            onValueChange={(value) => setValue("appointmentType", value)}
          >
            <SelectTrigger className="h-12">
              <SelectValue
                placeholder={typesLoading ? "Loading..." : "Select reason..."}
              />
            </SelectTrigger>
            <SelectContent>
              {appointmentTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  <div>
                    <div className="font-medium">{type.name}</div>
                    <div className="text-sm text-gray-500">
                      {type.description}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.appointmentType && (
            <p className="text-red-500 text-sm mt-2">
              {errors.appointmentType.message}
            </p>
          )}
        </div>

        {/* Doctor Selection */}
        <div>
          <h3
            className={`text-lg font-semibold mb-4 ${
              appointmentType ? "text-gray-900" : "text-gray-400"
            }`}
          >
            Who would you like to see?
          </h3>
          <Select
            value={doctorId}
            onValueChange={(value) => setValue("doctorId", value)}
            disabled={!appointmentType || doctorsLoading}
          >
            <SelectTrigger className="h-12">
              <SelectValue
                placeholder={
                  doctorsLoading ? "Loading..." : "Choose your provider"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {doctors.map((doctor) => (
                <SelectItem key={doctor.id} value={doctor.id}>
                  <div>
                    <div className="font-medium">
                      Dr. {doctor.firstName} {doctor.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {doctor.specialties.join(", ")}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.doctorId && (
            <p className="text-red-500 text-sm mt-2">
              {errors.doctorId.message}
            </p>
          )}
        </div>

        {/* Time Slot Selection */}
        {doctorId && (
          <div>
            <h3
              className={`text-lg font-semibold mb-4 ${
                doctorId ? "text-gray-900" : "text-gray-400"
              }`}
            >
              Select Your Preferred Time
            </h3>
            {timeSlotsLoading ? (
              <div className="flex justify-center py-8">
                <div className="flex items-center space-x-2 text-gray-600">
                  <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm">Loading available times...</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {timeSlots.map((slot) => (
                  <Button
                    key={slot.id}
                    type="button"
                    variant={
                      selectedTime === slot.startTime
                        ? "purple"
                        : !slot.isBooked
                        ? "outline"
                        : "grey"
                    }
                    size="lg"
                    className="h-12"
                    onClick={() =>
                      !slot.isBooked && setSelectedTime(slot.startTime)
                    }
                    disabled={slot.isBooked}
                  >
                    {formatTime(slot.startTime)}
                  </Button>
                ))}
              </div>
            )}

            {/* Legend */}
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-600 mt-4">
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
        )}
      </div>

      {/* Auto-progress indicator */}
      {isExisting !== undefined &&
        appointmentType &&
        doctorId &&
        selectedTime && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center space-x-2 text-purple-600">
              <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium">
                Proceeding to personal details...
              </span>
            </div>
          </div>
        )}
    </form>
  );
}
