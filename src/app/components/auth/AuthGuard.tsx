"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import CareLoader from "../ui/CareLoader";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { patient, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !patient) {
      router.push("/login");
    }
  }, [patient, isLoading, router]);

  if (isLoading) {
    return <CareLoader variant="full" message="Checking authentication..." />;
  }

  if (!patient) {
    return <CareLoader variant="full" message="Redirecting to login..." />;
  }

  return <>{children}</>;
}
