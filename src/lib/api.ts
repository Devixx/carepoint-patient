const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

class ApiError extends Error {
  constructor(public status: number, message: string, public data?: any) {
    super(message);
    this.name = "ApiError";
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("patient-token");

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorText = await response.text();
    let errorData;
    try {
      errorData = JSON.parse(errorText);
    } catch {
      errorData = errorText;
    }
    throw new ApiError(
      response.status,
      errorData?.message || errorText || response.statusText,
      errorData
    );
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  return response.text() as T;
}

// API functions
export const api = {
  // Auth
  login: async (credentials: { email: string; password: string }) => {
    return apiRequest<{ token: string; user: any }>("/auth/patients/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  register: async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    dateOfBirth?: string;
    address?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
  }) => {
    return apiRequest<{ token: string; user: any }>("/auth/patients/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Doctors
  getDoctors: async (params?: { specialty?: string; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.specialty && params.specialty !== "All Specialties") {
      searchParams.append("specialty", params.specialty);
    }
    if (params?.search) {
      searchParams.append("search", params.search);
    }

    const queryString = searchParams.toString();
    return apiRequest<any[]>(`/doctors${queryString ? `?${queryString}` : ""}`);
  },

  getDoctor: async (id: string) => {
    return apiRequest<any>(`/doctors/${id}`);
  },

  getDoctorAvailability: async (doctorId: string, date: string) => {
    return apiRequest<{ date: string; availableSlots: string[] }>(
      `/doctors/${doctorId}/availability?date=${date}`
    );
  },

  // Appointments - Updated to match backend expectations
  getPatientAppointments: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.status) searchParams.append("status", params.status);

    const queryString = searchParams.toString();
    return apiRequest<{ items: any[]; meta: any }>(
      `/patients/appointments${queryString ? `?${queryString}` : ""}`
    );
  },

  createAppointment: async (appointment: {
    doctorUserId: string; // Changed from doctorId to match backend
    startTime: string;
    endTime: string;
    type: string;
    title: string;
    description?: string;
  }) => {
    return apiRequest<any>("/appointments", {
      method: "POST",
      body: JSON.stringify(appointment),
    });
  },

  updateAppointment: async (id: string, updates: Partial<any>) => {
    return apiRequest<any>(`/appointments/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  },

  cancelAppointment: async (id: string) => {
    return apiRequest<any>(`/appointments/${id}`, {
      method: "DELETE",
    });
  },

  // Health Records
  getHealthRecords: async (params?: { category?: string; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.category && params.category !== "All") {
      searchParams.append("category", params.category);
    }
    if (params?.search) {
      searchParams.append("search", params.search);
    }

    const queryString = searchParams.toString();
    return apiRequest<any[]>(
      `/patients/records${queryString ? `?${queryString}` : ""}`
    );
  },

  // User Profile
  getProfile: async () => {
    return apiRequest<any>("/patients/profile");
  },

  updateProfile: async (updates: Partial<any>) => {
    return apiRequest<any>("/patients/profile", {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  },
};

export { ApiError };
