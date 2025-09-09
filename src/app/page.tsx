"use client";

import { useState } from "react";
import { AppointmentDetailsForm } from "@/components/appointment-details-form";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { PersonalDetailsForm } from "@/components/personal-details-form";
import { createAppointment } from "@/hooks/use-api";
import type {
  AppointmentDetailsFormData,
  PersonalDetailsFormData,
} from "@/lib/validations";
import { BookingStatusModal } from "@/components/booking-status-modal";

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [appointmentData, setAppointmentData] = useState<
    (AppointmentDetailsFormData & { selectedDate: Date }) | null
  >(null);
  const [personalData, setPersonalData] =
    useState<PersonalDetailsFormData | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    isSuccess: false,
    message: "",
  });

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
    handleBooking(data); // Trigger booking when personal details are submitted
  };

  const handleBooking = async (personalData: PersonalDetailsFormData) => {
    setIsSubmitting(true);

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
      setModalState({
        isOpen: true,
        isSuccess: true,
        message:
          "Your appointment has been confirmed. You will receive a confirmation email shortly.",
      });
    } catch (error) {
      console.error("Booking error:", error);
      setModalState({
        isOpen: true,
        isSuccess: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to book appointment",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const closeModalAndReset = () => {
    setModalState({ isOpen: false, isSuccess: false, message: "" });
    if (modalState.isSuccess) {
      // Reset all state to start over
      setCurrentStep(1);
      setAppointmentData(null);
      setPersonalData(null);
      setSelectedSlotId("");
      setIsSubmitting(false);
    } else {
      // If booking failed, just close the modal
      // The user can then retry submitting the form
      setIsSubmitting(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <AppointmentDetailsForm onNext={handleAppointmentDetailsNext} />;
      case 2:
        return (
          <PersonalDetailsForm
            onNext={handlePersonalDetailsNext}
            onBack={handleBack}
            isSubmitting={isSubmitting}
            appointmentData={appointmentData}
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

      <BookingStatusModal
        isOpen={modalState.isOpen}
        isSuccess={modalState.isSuccess}
        message={modalState.message}
        onClose={closeModalAndReset}
      />
    </div>
  );
}
