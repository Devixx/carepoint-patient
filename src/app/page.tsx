// src/app/page.tsx
"use client";

import Link from "next/link";
import { useFakeAuth } from "./contexts/FakeAuthContext";
import CareLoader from "@/app/components/ui/CareLoader";

export default function Home() {
  const { patient, isLoading, loginAsDemo, logout } = useFakeAuth();

  if (isLoading) {
    return <CareLoader variant="full" message="Signing in demo patient" />;
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-blue-600">CarePoint Patient</h1>
        <p className="text-gray-600">
          Use the demo login to preview the portal without real authentication.
        </p>

        {!patient ? (
          <button
            onClick={loginAsDemo}
            className="px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Login as Demo Patient
          </button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
              <div className="text-sm text-gray-700">
                Logged in as{" "}
                <span className="font-medium">
                  {patient.firstName} {patient.lastName}
                </span>{" "}
                ({patient.email})
              </div>
              <button
                onClick={logout}
                className="px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50 text-sm"
              >
                Logout
              </button>
            </div>

            <div className="flex gap-3">
              <Link
                href="/appointments"
                className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                My Appointments
              </Link>
              <Link
                href="/doctors"
                className="inline-flex items-center px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
              >
                Find Doctors
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
