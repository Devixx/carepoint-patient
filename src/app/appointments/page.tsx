"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  VideoCameraIcon,
  EllipsisVerticalIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { Button } from "../components/ui/Button";
import CareLoader from "../components/ui/CareLoader";
import BottomNavigation from "../components/navigation/BottomNavigation";
import DesktopSidebar from "../components/navigation/DesktopSidebar";

const mockAppointments = [
  {
    id: "1",
    date: "2025-01-08",
    time: "14:30",
    doctor: {
      name: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      photo: null,
    },
    status: "confirmed" as const,
    type: "In-person",
    location: "CarePoint Medical Center",
    reason: "Regular checkup",
    duration: 30,
    notes: "Please arrive 15 minutes early",
  },
  {
    id: "2",
    date: "2025-01-15",
    time: "10:00",
    doctor: {
      name: "Dr. Michael Chen",
      specialty: "Internal Medicine",
      photo: null,
    },
    status: "pending" as const,
    type: "Telehealth",
    location: "Video call",
    reason: "Follow-up consultation",
    duration: 20,
    notes: "Review lab results",
  },
  {
    id: "3",
    date: "2025-01-03",
    time: "09:15",
    doctor: {
      name: "Dr. Emily Rodriguez",
      specialty: "Dermatology",
      photo: null,
    },
    status: "completed" as const,
    type: "In-person",
    location: "Skin Health Center",
    reason: "Skin examination",
    duration: 25,
    notes: "Routine screening completed",
  },
];

const statusConfig = {
  confirmed: {
    label: "Confirmed",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  pending: {
    label: "Pending",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  completed: {
    label: "Completed",
    className: "bg-slate-100 text-slate-700 border-slate-200",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-100 text-red-700 border-red-200",
  },
};

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  const upcomingAppointments = mockAppointments.filter(
    (apt) => new Date(apt.date) >= new Date()
  );
  const pastAppointments = mockAppointments.filter(
    (apt) => new Date(apt.date) < new Date()
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <DesktopSidebar />

      <div className="lg:ml-64">
        <main className="pb-20 lg:pb-8">
          <div className="p-4 lg:p-8 space-y-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl p-6 text-white">
              <h1 className="text-3xl font-bold mb-2">My Appointments</h1>
              <p className="text-emerald-100 text-lg">
                Manage your healthcare visits
              </p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
              <div className="border-b border-slate-200">
                <nav className="flex">
                  <button
                    onClick={() => setActiveTab("upcoming")}
                    className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                      activeTab === "upcoming"
                        ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Upcoming ({upcomingAppointments.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("past")}
                    className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                      activeTab === "past"
                        ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Past ({pastAppointments.length})
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {activeTab === "upcoming" ? (
                  <div className="space-y-4">
                    {upcomingAppointments.length > 0 ? (
                      upcomingAppointments.map((appointment) => (
                        <AppointmentCard
                          key={appointment.id}
                          appointment={appointment}
                          showActions
                        />
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <CalendarIcon className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 mb-2">
                          No upcoming appointments
                        </h3>
                        <p className="text-slate-500 mb-4">
                          Book your next appointment to get started
                        </p>
                        <Button>Book Appointment</Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pastAppointments.map((appointment) => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="h-20 flex-col">
                <CalendarIcon className="h-6 w-6 mb-2" />
                Book New Appointment
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <ClockIcon className="h-6 w-6 mb-2" />
                Reschedule Existing
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <ChatBubbleLeftRightIcon className="h-6 w-6 mb-2" />
                Contact Support
              </Button>
            </div>
          </div>
        </main>
      </div>

      <BottomNavigation />
    </div>
  );
}

function AppointmentCard({
  appointment,
  showActions = false,
}: {
  appointment: any;
  showActions?: boolean;
}) {
  const status = statusConfig[appointment.status];
  const isVideo = appointment.type === "Telehealth";
  const appointmentDate = new Date(appointment.date);
  const isToday = appointmentDate.toDateString() === new Date().toDateString();
  const isTomorrow =
    appointmentDate.toDateString() ===
    new Date(Date.now() + 86400000).toDateString();

  let dateLabel = appointmentDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (isToday) dateLabel = "Today";
  if (isTomorrow) dateLabel = "Tomorrow";

  return (
    <div className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">
              {appointment.doctor.name.split(" ")[1][0]}
              {appointment.doctor.name.split(" ")[2][0]}
            </span>
          </div>

          <div>
            <h3 className="font-bold text-slate-900">
              {appointment.doctor.name}
            </h3>
            <p className="text-blue-600 font-medium text-sm">
              {appointment.doctor.specialty}
            </p>
            <p className="text-slate-600 text-sm mt-1">{appointment.reason}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium border ${status.className}`}
          >
            {status.label}
          </span>
          {isVideo && (
            <div className="flex items-center gap-1 px-2 py-1 bg-emerald-100 rounded-full">
              <VideoCameraIcon className="h-3 w-3 text-emerald-600" />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4" />
          <span>{dateLabel}</span>
        </div>
        <div className="flex items-center gap-2">
          <ClockIcon className="h-4 w-4" />
          <span>
            {appointment.time} ({appointment.duration} min)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MapPinIcon className="h-4 w-4" />
          <span>{appointment.location}</span>
        </div>
      </div>

      {appointment.notes && (
        <div className="mb-4 p-3 bg-slate-50 rounded-lg">
          <p className="text-sm text-slate-600">{appointment.notes}</p>
        </div>
      )}

      {showActions && (
        <div className="flex gap-3">
          <Button size="sm">
            {isVideo ? "Join Video Call" : "Get Directions"}
          </Button>
          <Button variant="outline" size="sm">
            Reschedule
          </Button>
          <Button variant="outline" size="sm">
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}
