const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

let globalAuthHandler: ((reason?: string) => void) | null = null;

export const setGlobalAuthHandler = (handler: (reason?: string) => void) => {
  globalAuthHandler = handler;
};

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
  // Public endpoints that don't need authentication
  const publicEndpoints = [
    "/auth/patients/login",
    "/auth/patients/register",
    "/doctors",
  ];

  const isPublicEndpoint = publicEndpoints.some((publicEndpoint) =>
    endpoint.startsWith(publicEndpoint)
  );

  const token = localStorage.getItem("patient-token");

  console.log("🌐 API Request:", {
    url: `${API_BASE_URL}${endpoint}`,
    method: options.method || "GET",
    isPublic: isPublicEndpoint,
    hasToken: !!token,
    tokenPreview: token ? `${token.substring(0, 20)}...` : null,
  });

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  // Add authorization header for protected endpoints
  if (!isPublicEndpoint && token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  console.log("📤 Request headers:", headers);

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

      // Handle authentication errors for protected endpoints
      if (response.status === 401 && !isPublicEndpoint) {
        console.warn("🔑 Authentication failed - triggering auth handler");
        localStorage.removeItem("patient-token");

        if (globalAuthHandler) {
          const message =
            errorData?.message === "Unauthorized"
              ? "Your session has expired. Please sign in again."
              : errorData?.message ||
                "Authentication failed. Please sign in again.";

          setTimeout(() => globalAuthHandler!(message), 0);
        }
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
      console.log("✅ API Success:", { hasData: !!data });
      return data;
    }

    const textData = await response.text();
    console.log("✅ API Success (text)");
    return textData as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    console.error("🔥 Network Error:", error);
    throw new ApiError(0, "Network error occurred", error);
  }
}

export const api = {
  // Auth endpoints
  login: async (credentials: { email: string; password: string }) => {
    console.log("🔐 API: Attempting login for:", credentials.email);

    const response = await apiRequest<{ token: string; user: any }>(
      "/auth/patients/login",
      {
        method: "POST",
        body: JSON.stringify(credentials),
      }
    );

    console.log("📥 API: Login response received:", {
      hasToken: !!response.token,
      hasUser: !!response.user,
      userEmail: response.user?.email,
    });

    if (response.token) {
      localStorage.setItem("patient-token", response.token);
      console.log("💾 API: Token stored in localStorage");

      // Verify it was actually saved
      const verification = localStorage.getItem("patient-token");
      console.log("🔍 API: Token verification after save:", !!verification);
    } else {
      console.error("❌ API: No token in response!");
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
    console.log("📝 API: Attempting registration for:", data.email);

    const response = await apiRequest<{ token: string; user: any }>(
      "/auth/patients/register",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    console.log("📥 API: Registration response received:", {
      hasToken: !!response.token,
      hasUser: !!response.user,
      userEmail: response.user?.email,
    });

    if (response.token) {
      localStorage.setItem("patient-token", response.token);
      console.log("💾 API: Token stored in localStorage after registration");

      // Verify it was actually saved
      const verification = localStorage.getItem("patient-token");
      console.log("🔍 API: Token verification after save:", !!verification);
    } else {
      console.error("❌ API: No token in registration response!");
    }

    return response;
  },

  // Protected endpoints
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

    console.log("📋 API: Fetching patient appointments");
    return apiRequest<{ items: any[]; meta: any }>(endpoint);
  },

  getProfile: async () => {
    console.log("👤 API: Fetching patient profile");
    return apiRequest<any>("/patients/profile");
  },

  // Public endpoints
  getDoctors: async (params?: { specialty?: string; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.specialty && params.specialty !== "All Specialties") {
      searchParams.append("specialty", params.specialty);
    }
    if (params?.search) {
      searchParams.append("search", params.search);
    }

    const queryString = searchParams.toString();
    console.log("👩‍⚕️ API: Fetching doctors");
    return apiRequest<any[]>(`/doctors${queryString ? `?${queryString}` : ""}`);
  },

  getDoctor: async (doctorId: string) => {
    console.log("👨‍⚕️ API: Fetching doctor profile");
    return apiRequest<any>(`/doctors/${doctorId}`);
  },

  getDoctorAvailability: async (doctorId: string, date: string) => {
    console.log("📅 API: Fetching doctor availability", {
      doctorId,
      date,
      fullUrl: `${API_BASE_URL}/doctors/${doctorId}/availability?date=${date}`
    });
    const result = await apiRequest<{ date: string; availableSlots: string[] }>(
      `/doctors/${doctorId}/availability?date=${date}`
    );
    console.log("📅 API: Availability response:", {
      date: result.date,
      slotsCount: result.availableSlots?.length,
      slots: result.availableSlots
    });
    return result;
  },

  createAppointment: async (appointment: {
    doctorUserId: string;
    startTime: string;
    endTime: string;
    type: string;
    title: string;
    description?: string;
  }) => {
    console.log("➕ API: Creating appointment");
    return apiRequest<any>("/appointments", {
      method: "POST",
      body: JSON.stringify(appointment),
    });
  },

  updateAppointment: async (id: string, updates: Partial<any>) => {
    console.log("✏️ API: Updating appointment");
    return apiRequest<any>(`/appointments/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  },

  cancelAppointment: async (id: string) => {
    console.log("❌ API: Cancelling appointment");
    return apiRequest<any>(`/appointments/${id}`, {
      method: "DELETE",
    });
  },

  updateProfile: async (updates: Partial<any>) => {
    console.log("✏️ API: Updating profile");
    return apiRequest<any>("/patients/profile", {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  },

  // Utility functions
  logout: () => {
    console.log("🚪 API: Clearing token");
    localStorage.removeItem("patient-token");
  },

  isAuthenticated: () => {
    const hasToken = !!localStorage.getItem("patient-token");
    console.log("🔍 API: Checking authentication:", hasToken);
    return hasToken;
  },

  // Add to the api object
  sendChatMessage: async (message: string) => {
    console.log("💬 Sending chat message:", message);
    return apiRequest<{ message: string; suggestions?: string[]; data?: any }>(
      "/chat/message",
      {
        method: "POST",
        body: JSON.stringify({ message }),
      }
    );
  },

  // Debug function
  debugToken: () => {
    const token = localStorage.getItem("patient-token");
    console.log("🔧 Debug token:", {
      exists: !!token,
      length: token?.length,
      preview: token ? `${token.substring(0, 20)}...` : null,
    });
    return token;
  },
};

export { ApiError };

// Make API available in browser console for debugging
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  (window as any).api = api;
  (window as any).debugAuth = () => {
    console.log("🔧 Auth Debug Info:");
    console.log("Token exists:", !!localStorage.getItem("patient-token"));
    console.log("Token value:", localStorage.getItem("patient-token"));
    api.debugToken();
  };
}
