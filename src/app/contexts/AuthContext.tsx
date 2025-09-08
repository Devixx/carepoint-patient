"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api } from "@/lib/api";

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

type AuthContextType = {
  patient: Patient | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<Patient>) => Promise<void>;
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("patient-token");
      if (token) {
        try {
          const profile = await api.getProfile();
          setPatient(profile);
        } catch (error) {
          // Token is invalid, remove it
          localStorage.removeItem("patient-token");
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.login({ email, password });
    localStorage.setItem("patient-token", response.token);
    setPatient(response.user);
  };

  const register = async (data: RegisterData) => {
    const response = await api.register(data);
    localStorage.setItem("patient-token", response.token);
    setPatient(response.user);
  };

  const logout = () => {
    localStorage.removeItem("patient-token");
    setPatient(null);
  };

  const updateProfile = async (data: Partial<Patient>) => {
    const updatedProfile = await api.updateProfile(data);
    setPatient(updatedProfile);
  };

  const value = useMemo(
    () => ({ patient, isLoading, login, register, logout, updateProfile }),
    [patient, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
