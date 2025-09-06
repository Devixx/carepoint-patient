const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const getAuthHeaders = () => {
  const token = localStorage.getItem("patient-token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  specialty: string;
  licenseNumber?: string;
  workingHours?: Record<string, unknown>;
  isActive: boolean;
  photo?: string;
  rating?: number;
  experience?: string;
  education?: string;
  bio?: string;
  languages?: string[];
}

export interface DoctorAvailability {
  date: string;
  slots: string[];
}

// Get all doctors
export const getDoctors = async (specialty?: string): Promise<Doctor[]> => {
  const url = new URL(`${API_BASE}/doctors`);
  if (specialty) {
    url.searchParams.set("specialty", specialty);
  }

  const response = await fetch(url.toString(), {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch doctors");
  }

  return response.json();
};

// Get doctor by ID
export const getDoctor = async (doctorId: string): Promise<Doctor> => {
  const response = await fetch(`${API_BASE}/doctors/${doctorId}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch doctor");
  }

  return response.json();
};

// Get doctor availability
export const getDoctorAvailability = async (
  doctorId: string,
  date: string
): Promise<string[]> => {
  const response = await fetch(
    `${API_BASE}/doctors/${doctorId}/availability?date=${date}`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch availability");
  }

  const data = await response.json();
  return data.availableSlots || [];
};

// Get doctor reviews
export const getDoctorReviews = async (doctorId: string) => {
  const response = await fetch(`${API_BASE}/doctors/${doctorId}/reviews`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch reviews");
  }

  return response.json();
};

// Search doctors
export interface DoctorSearchParams {
  specialty?: string;
  location?: string;
  availability?: string;
  rating?: number;
  search?: string;
}

export const searchDoctors = async (
  params: DoctorSearchParams
): Promise<Doctor[]> => {
  const url = new URL(`${API_BASE}/doctors/search`);

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value.toString());
    }
  });

  const response = await fetch(url.toString(), {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to search doctors");
  }

  return response.json();
};
