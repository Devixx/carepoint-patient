"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Patient = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
};

type FakeAuthContextType = {
  patient: Patient | null;
  isLoading: boolean;
  loginAsDemo: () => Promise<void>;
  logout: () => void;
};

const FakeAuthContext = createContext<FakeAuthContextType | undefined>(
  undefined
);

const DEMO_PATIENT: Patient = {
  id: "pat-demo-001",
  email: "john.smith@example.com",
  firstName: "John",
  lastName: "Smith",
  phone: "+352 621 000 000",
};

export function FakeAuthProvider({ children }: { children: React.ReactNode }) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("patient-token");
    const cached = localStorage.getItem("patient-demo");
    if (token && cached) {
      try {
        setPatient(JSON.parse(cached) as Patient);
      } catch {
        localStorage.removeItem("patient-demo");
      }
    }
    setIsLoading(false);
  }, []);

  const loginAsDemo = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    localStorage.setItem("patient-token", "demo-token");
    localStorage.setItem("patient-demo", JSON.stringify(DEMO_PATIENT));
    setPatient(DEMO_PATIENT);
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("patient-token");
    localStorage.removeItem("patient-demo");
    setPatient(null);
  };

  const value = useMemo(
    () => ({ patient, isLoading, loginAsDemo, logout }),
    [patient, isLoading]
  );

  return (
    <FakeAuthContext.Provider value={value}>
      {children}
    </FakeAuthContext.Provider>
  );
}

export function useFakeAuth() {
  const ctx = useContext(FakeAuthContext);
  if (!ctx) throw new Error("useFakeAuth must be used within FakeAuthProvider");
  return ctx;
}
