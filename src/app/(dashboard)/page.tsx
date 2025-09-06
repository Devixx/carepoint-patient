"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useFakeAuth } from "../contexts/FakeAuthContext";
import { WelcomeCard } from "../components/dashboard/WelcomeCard";
import { QuickActions } from "../components/dashboard/QuickActions";
import { StatusBadge } from "../components/ui/StatusBadge";
import CareLoader from "../components/ui/CareLoader";

// Mock upcoming appointments
const mockUpcomingAppointments = [
  {
    id: "1",
    date: "2025-01-08",
    time: "14:30",
    doctor: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    status: "confirmed" as const,
    type: "In-person",
  },
  {
    id: "2",
    date: "2025-01-15",
    time: "10:00",
    doctor: "Dr. Michael Chen",
    specialty: "Internal Medicine",
    status: "pending" as const,
    type: "Telehealth",
  },
];

export default function DashboardHome() {
  const { patient, isLoading, loginAsDemo } = useFakeAuth();

  // Auto-login demo for seamless UX
  useEffect(() => {
    if (!isLoading && !patient) {
      loginAsDemo();
    }
  }, [isLoading, patient, loginAsDemo]);

  if (isLoading || !patient) {
    return <CareLoader variant="full" message="Preparing your dashboard" />;
  }

  return (
    <div className="p-4 lg:p-8 space-y-6 animate-fade-in">
      {/* Welcome Card */}
      <WelcomeCard />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <QuickActions />
        </div>

        {/* Upcoming Appointments */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Upcoming
          </h3>
          <div className="space-y-4">
            {mockUpcomingAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="p-3 bg-surface-accent rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-text-primary">
                    {appointment.doctor}
                  </p>
                  <StatusBadge status={appointment.status} />
                </div>
                <p className="text-xs text-text-subtle">
                  {new Date(appointment.date).toLocaleDateString()} at{" "}
                  {appointment.time}
                </p>
                <p className="text-xs text-text-subtle">
                  {appointment.specialty} • {appointment.type}
                </p>
              </div>
            ))}

            <button className="w-full text-left p-3 text-sm text-brand-blue hover:bg-brand-blue/5 rounded-lg transition-colors focus-ring">
              View all appointments →
            </button>
          </div>
        </div>
      </div>

      {/* Health Summary */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Health Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-surface-accent rounded-lg">
            <p className="text-2xl font-bold text-brand-green">98%</p>
            <p className="text-sm text-text-subtle">Vaccination Rate</p>
          </div>
          <div className="text-center p-4 bg-surface-accent rounded-lg">
            <p className="text-2xl font-bold text-brand-blue">3</p>
            <p className="text-sm text-text-subtle">Active Prescriptions</p>
          </div>
          <div className="text-center p-4 bg-surface-accent rounded-lg">
            <p className="text-2xl font-bold text-text-primary">12</p>
            <p className="text-sm text-text-subtle">Past Visits</p>
          </div>
        </div>
      </div>
    </div>
  );
}
