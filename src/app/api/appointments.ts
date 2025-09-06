const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const getAuthHeaders = () => {
  const token = localStorage.getItem("patient-token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export interface Appointment {
  id: string;
  startTime: string;
  endTime: string;
  status: "scheduled" | "confirmed" | "in_progress" | "completed" | "cancelled";
  type: "consultation" | "follow_up" | "routine_checkup" | "emergency";
  title: string;
  description?: string;
  notes?: string;
  fee?: number;
  doctor: {
    id: string;
    firstName: string;
    lastName: string;
    specialty: string;
    phone?: string;
    photo?: string;
  };
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
}

export interface CreateAppointmentDto {
  doctorId: string;
  startTime: string;
  endTime: string;
  type: string;
  title: string;
  description?: string;
}

// Get patient appointments
export const getPatientAppointments = async (): Promise<{
  items: Appointment[];
  meta: unknown;
}> => {
  const response = await fetch(`${API_BASE}/patients/appointments`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch appointments");
  }

  return response.json();
};

// Create new appointment
export const createAppointment = async (
  appointmentData: CreateAppointmentDto
): Promise<Appointment> => {
  const response = await fetch(`${API_BASE}/appointments`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(appointmentData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to book appointment");
  }

  return response.json();
};

// Cancel appointment
export const cancelAppointment = async (
  appointmentId: string
): Promise<void> => {
  const response = await fetch(`${API_BASE}/appointments/${appointmentId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to cancel appointment");
  }
};

// Reschedule appointment
export const rescheduleAppointment = async (
  appointmentId: string,
  startTime: string,
  endTime: string
): Promise<Appointment> => {
  const response = await fetch(`${API_BASE}/appointments/${appointmentId}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ startTime, endTime }),
  });

  if (!response.ok) {
    throw new Error("Failed to reschedule appointment");
  }

  return response.json();
};

// Get appointment by ID
export const getAppointment = async (
  appointmentId: string
): Promise<Appointment> => {
  const response = await fetch(`${API_BASE}/appointments/${appointmentId}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch appointment details");
  }

  return response.json();
};
