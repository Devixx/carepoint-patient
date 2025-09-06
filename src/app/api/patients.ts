const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const getAuthHeaders = () => {
  const token = localStorage.getItem("patient-token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export interface PatientProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  medicalHistory?: string;
  insurance?: string;
  allergies?: string;
  medications?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HealthRecord {
  id: string;
  date: string;
  type: "lab_result" | "prescription" | "visit_note" | "imaging" | "vaccine";
  title: string;
  description?: string;
  provider: string;
  status: "active" | "reviewed" | "archived";
  attachments?: string[];
  results?: Record<string, unknown>;
}

// Get patient profile
export const getPatientProfile = async (): Promise<PatientProfile> => {
  const response = await fetch(`${API_BASE}/patients/profile`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }

  return response.json();
};

// Update patient profile
export const updatePatientProfile = async (
  updates: Partial<PatientProfile>
): Promise<PatientProfile> => {
  const response = await fetch(`${API_BASE}/patients/profile`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error("Failed to update profile");
  }

  return response.json();
};

// Get health records
export const getHealthRecords = async (): Promise<HealthRecord[]> => {
  const response = await fetch(`${API_BASE}/patients/health-records`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch health records");
  }

  return response.json();
};

// Get specific health record
export const getHealthRecord = async (
  recordId: string
): Promise<HealthRecord> => {
  const response = await fetch(
    `${API_BASE}/patients/health-records/${recordId}`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch health record");
  }

  return response.json();
};

// Upload document
export const uploadDocument = async (
  file: File,
  type: string
): Promise<unknown> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);

  const token = localStorage.getItem("patient-token");
  const response = await fetch(`${API_BASE}/patients/documents`, {
    method: "POST",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload document");
  }

  return response.json();
};

// Get patient statistics
export const getPatientStats = async () => {
  const response = await fetch(`${API_BASE}/patients/stats`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch patient stats");
  }

  return response.json();
};
