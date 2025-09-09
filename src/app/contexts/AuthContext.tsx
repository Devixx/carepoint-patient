"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";

type Patient = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
};

type RegisterData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
};

type AuthContextType = {
  patient: Patient | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<Patient>) => Promise<void>;
  redirectToLogin: (reason?: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const redirectToLogin = (reason?: string) => {
    console.log("🔄 Redirecting to login:", reason);

    if (reason) {
      toast.error(reason);
    }

    // Clear patient data and token
    setPatient(null);
    localStorage.removeItem("patient-token");

    // Redirect to login
    router.push("/login");
  };

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("patient-token");
      console.log("🔍 Checking auth on mount, token present:", !!token);

      if (!token) {
        console.log("🔍 No token found");
        setIsLoading(false);
        return;
      }

      try {
        console.log("🔍 Validating existing token");
        const profile = await api.getProfile();
        setPatient(profile);
        console.log("✅ Token valid, patient authenticated:", profile.email);
      } catch (error: any) {
        console.error("❌ Token validation failed:", error);

        if (error?.status === 401) {
          redirectToLogin("Your session has expired. Please sign in again.");
        } else {
          localStorage.removeItem("patient-token");
          toast.error("Authentication error. Please try signing in again.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log("🔐 Attempting login for:", email);

      const response = await api.login({ email, password });
      console.log("📥 Login response received:", response);

      // Verify token is in response
      if (!response.token) {
        throw new Error("No token received from server");
      }

      // Verify token was saved
      const savedToken = localStorage.getItem("patient-token");
      console.log("💾 Token saved to localStorage:", !!savedToken);

      setPatient(response.user);
      console.log("✅ Login successful, patient set:", response.user.email);
      toast.success("Welcome back!");
    } catch (error: any) {
      console.error("❌ Login failed:", error);
      toast.error(error.message || "Login failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      console.log("📝 Attempting registration for:", data.email);

      const response = await api.register(data);
      console.log("📥 Registration response received:", response);

      // Verify token is in response
      if (!response.token) {
        throw new Error("No token received from server");
      }

      // Verify token was saved
      const savedToken = localStorage.getItem("patient-token");
      console.log("💾 Token saved to localStorage:", !!savedToken);

      setPatient(response.user);
      console.log(
        "✅ Registration successful, patient set:",
        response.user.email
      );
      toast.success("Account created successfully!");
    } catch (error: any) {
      console.error("❌ Registration failed:", error);
      toast.error(error.message || "Registration failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log("🚪 Logging out");
    setPatient(null);
    localStorage.removeItem("patient-token");
    toast.success("Signed out successfully");
    router.push("/login");
  };

  const updateProfile = async (data: Partial<Patient>) => {
    try {
      const updatedProfile = await api.updateProfile(data);
      setPatient(updatedProfile);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("❌ Profile update failed:", error);

      if (error?.status === 401) {
        redirectToLogin("Your session has expired. Please sign in again.");
        return;
      }

      throw error;
    }
  };

  const isAuthenticated = !!patient && !!localStorage.getItem("patient-token");

  const value = useMemo(
    () => ({
      patient,
      isLoading,
      isAuthenticated,
      login,
      register,
      logout,
      updateProfile,
      redirectToLogin,
    }),
    [patient, isLoading, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
