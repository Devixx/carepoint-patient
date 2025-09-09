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

  // Debug logs
  console.log("🌐 API Request:", {
    url: `${API_BASE_URL}${endpoint}`,
    method: options.method || "GET",
    hasToken: !!token,
    tokenPreview: token ? `${token.substring(0, 20)}...` : null,
  });

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  // Add authorization header if token exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  console.log("📤 Request config:", {
    headers: headers,
    method: config.method || "GET",
  });

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    console.log("📥 Response:", {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;

      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }

      console.error("❌ API Error:", {
        status: response.status,
        statusText: response.statusText,
        data: errorData,
      });

      // Handle 401 specifically for token issues
      if (response.status === 401) {
        console.warn("🔑 Authentication failed - clearing token");
        localStorage.removeItem("patient-token");
      }

      throw new ApiError(
        response.status,
        errorData?.message || errorText || response.statusText,
        errorData
      );
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      console.log("✅ API Success:", data);
      return data;
    }

    const textData = await response.text();
    console.log("✅ API Success (text):", textData);
    return textData as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    console.error("🔥 Network Error:", error);
    throw new ApiError(0, "Network error occurred", error);
  }
}

// API functions
export const api = {
  // Auth endpoints
  login: async (credentials: { email: string; password: string }) => {
    console.log("🔐 Attempting login for:", credentials.email);

    const response = await apiRequest<{ token: string; user: any }>(
      "/auth/patients/login",
      {
        method: "POST",
        body: JSON.stringify(credentials),
      }
    );

    // Store token after successful login
    if (response.token) {
      localStorage.setItem("patient-token", response.token);
      console.log("💾 Token stored successfully");
    }

    return response;
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
    console.log("📝 Attempting registration for:", data.email);

    const response = await apiRequest<{ token: string; user: any }>(
      "/auth/patients/register",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    // Store token after successful registration
    if (response.token) {
      localStorage.setItem("patient-token", response.token);
      console.log("💾 Token stored after registration");
    }

    return response;
  },

  // Doctors endpoints
  getDoctors: async (params?: { specialty?: string; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.specialty && params.specialty !== "All Specialties") {
      searchParams.append("specialty", params.specialty);
    }
    if (params?.search) {
      searchParams.append("search", params.search);
    }

    const queryString = searchParams.toString();
    const endpoint = `/doctors${queryString ? `?${queryString}` : ""}`;

    console.log("👩‍⚕️ Fetching doctors:", endpoint);
    return apiRequest<any[]>(endpoint);
  },

  getDoctor: async (id: string) => {
    console.log("👨‍⚕️ Fetching doctor:", id);
    return apiRequest<any>(`/doctors/${id}`);
  },

  getDoctorAvailability: async (doctorId: string, date: string) => {
    console.log("📅 Fetching availability for doctor:", doctorId, "on", date);
    return apiRequest<{ date: string; availableSlots: string[] }>(
      `/doctors/${doctorId}/availability?date=${date}`
    );
  },

  // Appointments endpoints
  getPatientAppointments: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    start?: string;
    end?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.status) searchParams.append("status", params.status);
    if (params?.start) searchParams.append("start", params.start);
    if (params?.end) searchParams.append("end", params.end);

    const queryString = searchParams.toString();
    const endpoint = `/patients/appointments${
      queryString ? `?${queryString}` : ""
    }`;

    console.log("📋 Fetching patient appointments:", endpoint);
    return apiRequest<{ items: any[]; meta: any }>(endpoint);
  },

  createAppointment: async (appointment: {
    doctorUserId: string;
    startTime: string;
    endTime: string;
    type: string;
    title: string;
    description?: string;
  }) => {
    console.log("➕ Creating appointment:", appointment);
    return apiRequest<any>("/appointments", {
      method: "POST",
      body: JSON.stringify(appointment),
    });
  },

  updateAppointment: async (id: string, updates: Partial<any>) => {
    console.log("✏️ Updating appointment:", id, updates);
    return apiRequest<any>(`/appointments/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  },

  cancelAppointment: async (id: string) => {
    console.log("❌ Cancelling appointment:", id);
    return apiRequest<any>(`/appointments/${id}`, {
      method: "DELETE",
    });
  },

  // Health Records endpoints
  getHealthRecords: async (params?: { category?: string; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.category && params.category !== "All") {
      searchParams.append("category", params.category);
    }
    if (params?.search) {
      searchParams.append("search", params.search);
    }

    const queryString = searchParams.toString();
    const endpoint = `/patients/records${queryString ? `?${queryString}` : ""}`;

    console.log("📄 Fetching health records:", endpoint);
    return apiRequest<any[]>(endpoint);
  },

  // Profile endpoints
  getProfile: async () => {
    console.log("👤 Fetching patient profile");
    return apiRequest<any>("/patients/profile");
  },

  updateProfile: async (updates: Partial<any>) => {
    console.log("✏️ Updating patient profile:", updates);
    return apiRequest<any>("/patients/profile", {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  },

  // Utility functions
  logout: () => {
    console.log("🚪 Logging out - clearing token");
    localStorage.removeItem("patient-token");
  },

  isAuthenticated: () => {
    const token = localStorage.getItem("patient-token");
    const isAuth = !!token;
    console.log("🔍 Checking authentication:", isAuth);
    return isAuth;
  },

  getStoredToken: () => {
    const token = localStorage.getItem("patient-token");
    console.log("🎫 Getting stored token:", token ? "Present" : "Missing");
    return token;
  },

  // Debug function to test token
  testToken: async () => {
    console.log("🧪 Testing token validity");
    try {
      const profile = await api.getProfile();
      console.log("✅ Token is valid:", profile);
      return true;
    } catch (error) {
      console.error("❌ Token is invalid:", error);
      return false;
    }
  },
};

export { ApiError };

// Debug helper for development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  (window as any).api = api;
  console.log("🔧 API client available as window.api for debugging");
}
