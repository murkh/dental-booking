"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/utils";
import { useTimeSlots } from "@/hooks/use-api";

interface TimeSlotSelectionProps {
  onNext: (selectedSlotId: string) => void;
  doctorId: string;
  selectedDate: Date;
  isSubmitting?: boolean;
  isValid?: boolean;
}

export function TimeSlotSelection({
  onNext,
  doctorId,
  selectedDate,
  isSubmitting = false,
  isValid = false,
}: TimeSlotSelectionProps) {
  const [selectedSlotId, setSelectedSlotId] = useState<string>("");
  const { timeSlots, loading, error } = useTimeSlots(doctorId, selectedDate);

  const handleTimeSelect = (slotId: string) => {
    setSelectedSlotId(slotId);
  };

  const handleNext = () => {
    if (selectedSlotId) {
      onNext(selectedSlotId);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-8">
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Select Your Preferred Time
          </h3>
          <p className="text-gray-600">
            Available time slots for{" "}
            {selectedDate.toLocaleDateString("en-GB", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Time Slots Grid */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Loading available times...</span>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">
            <p className="text-sm">
              Failed to load time slots. Please try again.
            </p>
          </div>
        ) : timeSlots.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No available time slots for this date.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {timeSlots.map((slot) => (
              <Button
                key={slot.id}
                variant={
                  selectedSlotId === slot.id
                    ? "purple"
                    : !slot.isBooked
                    ? "outline"
                    : "grey"
                }
                size="lg"
                className="h-12"
                onClick={() =>
                  !slot.isBooked &&
                  !isSubmitting &&
                  handleTimeSelect(slot.id)
                }
                disabled={slot.isBooked || isSubmitting}
              >
                {isSubmitting && selectedSlotId === slot.id ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Booking...</span>
                  </div>
                ) : (
                  formatTime(slot.startTime)
                )}
              </Button>
            ))}
          </div>
        )}

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

        <div className="flex justify-end">
          <Button
            onClick={handleNext}
            disabled={!isValid || !selectedSlotId || isSubmitting}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
