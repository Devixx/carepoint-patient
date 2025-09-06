// src/app/appointments/page.tsx
"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import CareLoader from "@/app/components/ui/CareLoader";
import { useFakeAuth } from "../contexts/FakeAuthContext";

async function fetchAppointments() {
  const token = localStorage.getItem("patient-token") || "";
  const r = await fetch("http://localhost:3001/patients/appointments", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export default function AppointmentsPage() {
  const { patient, isLoading, loginAsDemo } = useFakeAuth();

  React.useEffect(() => {
    if (!isLoading && !patient) {
      loginAsDemo();
    }
  }, [isLoading, patient, loginAsDemo]);

  const {
    data,
    isLoading: fetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["patient-appointments"],
    queryFn: fetchAppointments,
    enabled: !!patient,
  });

  if (isLoading || (!patient && !isError)) {
    return <CareLoader variant="full" message="Preparing your appointments" />;
  }

  if (fetching) {
    return <CareLoader variant="card" message="Loading your appointments" />;
  }

  if (isError) {
    return (
      <div className="p-6 max-w-xl mx-auto">
        <div className="rounded-lg border border-red-200 bg-white p-4">
          <h2 className="text-red-700 font-semibold">
            Failed to load appointments
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {(error as Error).message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">My Appointments</h1>
      {data?.items?.length ? (
        <ul className="space-y-3">
          {data.items.map((apt: unknown) => (
            <li
              key={apt.id}
              className="p-4 bg-white border border-gray-200 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    {apt.title || "Appointment"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(apt.startTime).toLocaleString()}
                  </p>
                </div>
                <span className="px-2 py-1 text-xs rounded-full border bg-gray-50 capitalize">
                  {apt.status?.replace("_", " ")}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
          No appointments found. Book your first visit.
        </div>
      )}
    </main>
  );
}
