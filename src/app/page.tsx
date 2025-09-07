"use client";

import { useState } from "react";
import { useEffect } from "react";
import { AppointmentDetailsForm } from "@/components/appointment-details-form";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { PersonalDetailsForm } from "@/components/personal-details-form";
import { createAppointment } from "@/hooks/use-api";
import type {
  AppointmentDetailsFormData,
  PersonalDetailsFormData,
} from "@/lib/validations";

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [appointmentData, setAppointmentData] = useState<
    (AppointmentDetailsFormData & { selectedDate: Date }) | null
  >(null);
  const [personalData, setPersonalData] =
    useState<PersonalDetailsFormData | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const handleAppointmentDetailsNext = (
    data: AppointmentDetailsFormData & { slotId: string; selectedDate: Date }
  ) => {
    setAppointmentData({
      isExisting: data.isExisting,
      appointmentType: data.appointmentType,
      doctorId: data.doctorId,
      selectedDate: data.selectedDate, // Store selectedDate
    });
    setSelectedSlotId(data.slotId);
    setCurrentStep(2);
  };

  const handlePersonalDetailsNext = (data: PersonalDetailsFormData) => {
    setPersonalData(data);
  };

  const handleBooking = async () => {
    setIsSubmitting(true);
    setBookingError(null);

    try {
      if (!appointmentData || !personalData || !selectedSlotId) {
        throw new Error("Missing appointment, personal data, or selected slot");
      }

      const bookingData = {
        patient: {
          firstName: personalData.firstName,
          lastName: personalData.lastName,
          email: personalData.email,
          phone: personalData.phone,
          dateOfBirth: personalData.dateOfBirth,
          sex: personalData.sex,
          medicalInfo: personalData.medicalInfo,
          isExisting: appointmentData.isExisting,
        },
        appointment: {
          doctorId: appointmentData.doctorId,
          appointmentTypeId: appointmentData.appointmentType,
          slotId: selectedSlotId,
          notes: personalData.medicalInfo,
          date: appointmentData.selectedDate, // Add selectedDate
        },
      };

      await createAppointment(bookingData);
      setBookingSuccess(true);
    } catch (error) {
      console.error("Booking error:", error);
      setBookingError(
        error instanceof Error ? error.message : "Failed to book appointment"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Only trigger booking when all required data is set and currentStep is 2
  useEffect(() => {
    if (
      currentStep === 2 &&
      appointmentData &&
      personalData &&
      selectedSlotId &&
      !isSubmitting &&
      !bookingSuccess &&
      !bookingError
    ) {
      handleBooking();
    }
  }, [appointmentData, personalData, selectedSlotId, currentStep]);
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderCurrentStep = () => {
    if (bookingSuccess) {
      return (
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>Success</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Appointment Booked Successfully!
          </h2>
          <p className="text-gray-600 mb-6">
            Your appointment has been confirmed. You will receive a confirmation
            email shortly.
          </p>
          <button
            type="button"
            onClick={() => {
              setCurrentStep(1);
              setAppointmentData(null);
              setPersonalData(null);
              setSelectedSlotId("");
              setBookingSuccess(false);
              setBookingError(null);
            }}
            className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors"
          >
            Book Another Appointment
          </button>
        </div>
      );
    }

    if (bookingError) {
      return (
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-red-200 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>Error</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Booking Failed
          </h2>
          <p className="text-gray-600 mb-6">{bookingError}</p>
          <button
            type="button"
            onClick={() => {
              setBookingError(null);
              setCurrentStep(1);
            }}
            className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return <AppointmentDetailsForm onNext={handleAppointmentDetailsNext} />;
      case 2:
        return (
          <PersonalDetailsForm
            onNext={handlePersonalDetailsNext}
            onBack={handleBack}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return <AppointmentDetailsForm onNext={handleAppointmentDetailsNext} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentStep={currentStep} />

      <main className="py-12">{renderCurrentStep()}</main>

      <Footer />
    </div>
  );
}
