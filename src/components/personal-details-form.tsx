"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  personalDetailsSchema,
  type PersonalDetailsFormData,
} from "@/lib/validations";

import type { AppointmentDetailsFormData } from "@/lib/validations";

interface PersonalDetailsFormProps {
  onNext: (data: PersonalDetailsFormData) => void;
  onBack: () => void;
  isSubmitting?: boolean;
  appointmentData?:
    | (AppointmentDetailsFormData & { selectedDate: Date })
    | null;
}

export function PersonalDetailsForm({
  onNext,
  onBack,
  isSubmitting = false,
  appointmentData,
}: PersonalDetailsFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PersonalDetailsFormData>({
    resolver: zodResolver(personalDetailsSchema),
    mode: "onChange",
  });

  // Compute cost and summary
  const isExisting = appointmentData?.isExisting;
  const cost = isExisting ? 70 : 100;
  const watchedFields = watch();

  // Auto-progress when all required fields are filled
  useEffect(() => {
    const {
      firstName,
      lastName,
      email,
      sex,
      dateOfBirth,
      phone,
      termsAccepted,
    } = watchedFields;

    if (
      firstName &&
      lastName &&
      email &&
      sex &&
      dateOfBirth &&
      phone &&
      termsAccepted
    ) {
      const timer = setTimeout(() => {
        onNext(watchedFields as PersonalDetailsFormData);
      }, 500); // Small delay for better UX

      return () => clearTimeout(timer);
    }
  }, [watchedFields, onNext]);

  const onSubmit = (data: PersonalDetailsFormData) => {
    onNext(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-8"
    >
      {/* Appointment Summary and Cost */}
      <div className="mb-6">
        <div className="text-lg font-bold text-purple-700">
          Appointment Cost: ${cost}
        </div>
      </div>
      <div className="space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              First Name *
            </label>
            <Input
              id="firstName"
              placeholder="Enter your first name"
              {...register("firstName")}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Last Name *
            </label>
            <Input
              id="lastName"
              placeholder="Enter your last name"
              {...register("lastName")}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email Address *
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        {/* Sex */}
        <div>
          <label
            htmlFor="sex"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Sex *
          </label>
          <Select onValueChange={(value) => setValue("sex", value)}>
            <SelectTrigger id="sex">
              <SelectValue placeholder="Choose your sex" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="prefer-not-to-say">
                Prefer not to say
              </SelectItem>
            </SelectContent>
          </Select>
          {errors.sex && (
            <p className="text-red-500 text-sm mt-1">{errors.sex.message}</p>
          )}
        </div>
        {/* Date of Birth */}
        <div>
          <label
            htmlFor="dateOfBirth"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Date of Birth *
          </label>
          <Input
            id="dateOfBirth"
            placeholder="DD/MM/YYYY"
            {...register("dateOfBirth")}
          />
          {errors.dateOfBirth && (
            <p className="text-red-500 text-sm mt-1">
              {errors.dateOfBirth.message}
            </p>
          )}
        </div>
        {/* Phone Number */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Phone Number *
          </label>
          <div className="flex space-x-2">
            <Select defaultValue="+44">
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="+44">🇬🇧 +44</SelectItem>
                <SelectItem value="+1">🇺🇸 +1</SelectItem>
                <SelectItem value="+33">🇫🇷 +33</SelectItem>
                <SelectItem value="+49">🇩🇪 +49</SelectItem>
              </SelectContent>
            </Select>
            <Input
              id="phone"
              placeholder="Enter your phone number"
              {...register("phone")}
              className="flex-1"
            />
          </div>
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>
        {/* Medical Information */}
        <div>
          <label
            htmlFor="medicalInfo"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Medical considerations or additional information
          </label>
          <Textarea
            id="medicalInfo"
            placeholder="Please type here..."
            {...register("medicalInfo")}
            rows={4}
          />
        </div>
        {/* Terms and Marketing */}
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="terms"
              onCheckedChange={(checked) =>
                setValue("termsAccepted", checked as boolean)
              }
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              I acknowledge and accept the{" "}
              <a
                href="/terms-of-use"
                className="text-purple-600 hover:text-purple-700 underline"
              >
                Terms of Use *
              </a>
            </label>
          </div>
          {errors.termsAccepted && (
            <p className="text-red-500 text-sm mt-1">
              {errors.termsAccepted.message}
            </p>
          )}
          <div className="flex items-start space-x-3">
            <Checkbox
              id="marketing"
              onCheckedChange={(checked) =>
                setValue("marketingConsent", checked as boolean)
              }
            />
            <label htmlFor="marketing" className="text-sm text-gray-700">
              I'd like to hear about new offers or services and accept the{" "}
              <a
                href="/contact-consent"
                className="text-purple-600 hover:text-purple-700 underline"
              >
                Contact Consent
              </a>
            </label>
          </div>
        </div>
      </div>
      {/* Auto-progress indicator */}
      {watchedFields.firstName &&
        watchedFields.lastName &&
        watchedFields.email &&
        watchedFields.sex &&
        watchedFields.dateOfBirth &&
        watchedFields.phone &&
        watchedFields.termsAccepted && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center space-x-2 text-purple-600">
              <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium">
                {isSubmitting
                  ? "Booking your appointment..."
                  : "Proceeding to book appointment..."}
              </span>
            </div>
          </div>
        )}
    </form>
  );
}
