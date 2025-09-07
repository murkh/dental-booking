import { z } from "zod";

export const appointmentDetailsSchema = z.object({
  isExisting: z.boolean(),
  appointmentType: z.string().min(1, "Please select an appointment type"),
  doctorId: z.string().min(1, "Please select a doctor"),
});

export const personalDetailsSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  sex: z.string().min(1, "Please select your sex"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  phone: z.string().min(1, "Phone number is required"),
  medicalInfo: z.string().optional(),
  termsAccepted: z
    .boolean()
    .refine((val) => val === true, "You must accept the terms of use"),
  marketingConsent: z.boolean().optional(),
});

export const timeSlotSchema = z.object({
  selectedTime: z.string().min(1, "Please select a time slot"),
});

export type AppointmentDetailsFormData = z.infer<
  typeof appointmentDetailsSchema
>;
export type PersonalDetailsFormData = z.infer<typeof personalDetailsSchema>;
export type TimeSlotFormData = z.infer<typeof timeSlotSchema>;
