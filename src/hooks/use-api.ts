import { useState, useEffect, useRef } from "react";

interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  specialties: string[];
}

interface AppointmentType {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  price: number | null;
}

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export function useDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/doctors");
        if (!response.ok) {
          throw new Error("Failed to fetch doctors");
        }
        const data = await response.json();
        setDoctors(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        // Fallback to mock data if API fails
        setDoctors([
          {
            id: "1",
            firstName: "Sarah",
            lastName: "Johnson",
            specialties: ["General Dentistry", "Preventive Care"],
          },
          {
            id: "2",
            firstName: "Michael",
            lastName: "Chen",
            specialties: ["Orthodontics", "Cosmetic Dentistry"],
          },
          {
            id: "3",
            firstName: "Emily",
            lastName: "Davis",
            specialties: ["Oral Surgery", "Implantology"],
          },
          {
            id: "4",
            firstName: "James",
            lastName: "Wilson",
            specialties: ["Periodontics", "Gum Treatment"],
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return { doctors, loading, error };
}

export function useAppointmentTypes() {
  const [appointmentTypes, setAppointmentTypes] = useState<AppointmentType[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointmentTypes = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/appointment-types");
        if (!response.ok) {
          throw new Error("Failed to fetch appointment types");
        }
        const data = await response.json();
        setAppointmentTypes(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentTypes();
  }, []);

  return { appointmentTypes, loading, error };
}

const timeSlotsCache = new Map<
  string,
  { data: TimeSlot[]; timestamp: number }
>();
const CACHE_DURATION = 5 * 60 * 1000;

const cleanupCache = () => {
  const now = Date.now();
  for (const [key, value] of timeSlotsCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      timeSlotsCache.delete(key);
    }
  }
};

export function useTimeSlots(doctorId: string, date: Date) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!doctorId || !date) {
      setTimeSlots([]);
      setLoading(false);
      setError(null);
      return;
    }

    const dateString = date.toISOString().split("T")[0];
    const cacheKey = `${doctorId}-${dateString}`;
    cleanupCache();
    const cached = timeSlotsCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setTimeSlots(cached.data);
      setLoading(false);
      setError(null);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const fetchTimeSlots = async () => {
      try {
        setLoading(true);
        setError(null);
        abortControllerRef.current = new AbortController();
        const response = await fetch(
          `/api/time-slots?doctorId=${doctorId}&date=${dateString}`,
          {
            signal: abortControllerRef.current.signal,
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch time slots");
        }
        const data = await response.json();
        timeSlotsCache.set(cacheKey, {
          data: data.slots,
          timestamp: Date.now(),
        });
        setTimeSlots(data.slots);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        setError(err instanceof Error ? err.message : "An error occurred");
        // Fallback to mock data if API fails
        const mockSlots = generateMockTimeSlots();
        setTimeSlots(mockSlots);
      } finally {
        setLoading(false);
      }
    };
    fetchTimeSlots();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [doctorId, date]);

  return { timeSlots, loading, error };
}

function generateMockTimeSlots(): TimeSlot[] {
  const slots = [];
  const startHour = 9;
  const endHour = 17;
  const interval = 40;

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minutes = 0; minutes < 60; minutes += interval) {
      if (hour === endHour - 1 && minutes > 0) break;

      const timeString = `${hour.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
      const endMinutes = minutes + interval;
      const calculatedEndHour = endMinutes >= 60 ? hour + 1 : hour;
      const endTimeMinutes = endMinutes >= 60 ? endMinutes - 60 : endMinutes;
      const endTime = `${calculatedEndHour
        .toString()
        .padStart(2, "0")}:${endTimeMinutes.toString().padStart(2, "0")}`;

      const isAvailable = Math.random() > 0.3;

      slots.push({
        id: `${hour}-${minutes}`,
        startTime: timeString,
        endTime,
        isBooked: !isAvailable,
      });
    }
  }

  return slots;
}

export async function createAppointment(appointmentData: {
  patient: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    sex: string;
    medicalInfo?: string;
    isExisting: boolean;
  };
  appointment: {
    doctorId: string;
    appointmentTypeId: string;
    slotId: string;
    notes?: string;
  };
}) {
  try {
    const response = await fetch("/api/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appointmentData),
    });

    if (!response.ok) {
      throw new Error("Failed to create appointment");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}
