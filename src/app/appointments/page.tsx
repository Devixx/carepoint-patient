"use client";

import { useState } from "react";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  VideoCameraIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { Button } from "../components/ui/Button";
import CareLoader from "../components/ui/CareLoader";
import BottomNavigation from "../components/navigation/BottomNavigation";
import DesktopSidebar from "../components/navigation/DesktopSidebar";
import {
  usePatientAppointments,
  useCancelAppointment,
  useUpdateAppointment,
} from "@/hooks/api";

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
  in_progress: {
    label: "In Progress",
    className: "bg-blue-100 text-blue-700 border-blue-200",
  },
  no_show: {
    label: "No Show",
    className: "bg-red-100 text-red-700 border-red-200",
  },
};

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  const {
    data: appointmentsData,
    isLoading,
    isError,
    error,
  } = usePatientAppointments();
  const cancelMutation = useCancelAppointment();
  const updateMutation = useUpdateAppointment();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <DesktopSidebar />
        <div className="lg:ml-64">
          <main className="pb-20 lg:pb-8">
            <CareLoader variant="full" message="Loading your appointments..." />
          </main>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-slate-50">
        <DesktopSidebar />
        <div className="lg:ml-64">
          <main className="pb-20 lg:pb-8">
            <div className="p-4 lg:p-8">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                <h3 className="font-bold text-red-900 mb-2">
                  Failed to load appointments
                </h3>
                <p className="text-red-700">
                  {(error as any)?.message || "Please try again later"}
                </p>
              </div>
            </div>
          </main>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  const appointments = appointmentsData?.items || [];
  const upcomingAppointments = appointments.filter(
    (apt) => new Date(apt.startTime) >= new Date() && apt.status !== "cancelled"
  );
  const pastAppointments = appointments.filter(
    (apt) => new Date(apt.startTime) < new Date() || apt.status === "cancelled"
  );

  const handleCancel = async (appointmentId: string) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      await cancelMutation.mutateAsync(appointmentId);
    }
  };

  const handleReschedule = (appointmentId: string) => {
    // In a real app, you'd open a reschedule modal
    window.location.href = `/appointments/new?reschedule=${appointmentId}`;
  };

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
                          onCancel={handleCancel}
                          onReschedule={handleReschedule}
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
                        <Button
                          onClick={() =>
                            (window.location.href = "/appointments/new")
                          }
                        >
                          Book Appointment
                        </Button>
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
              <Button
                className="h-20 flex-col"
                onClick={() => (window.location.href = "/appointments/new")}
              >
                <CalendarIcon className="h-6 w-6 mb-2" />
                Book New Appointment
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <ClockIcon className="h-6 w-6 mb-2" />
                Reschedule Existing
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col"
                onClick={() => (window.location.href = "/support")}
              >
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
  onCancel,
  onReschedule,
}: {
  appointment: any;
  showActions?: boolean;
  onCancel?: (id: string) => void;
  onReschedule?: (id: string) => void;
}) {
  const status = statusConfig[appointment.status as keyof typeof statusConfig];
  const isVideo = appointment.type === "Telehealth";
  const appointmentDate = new Date(appointment.startTime);
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
              {appointment.doctor?.firstName?.[0]}
              {appointment.doctor?.lastName?.[0]}
            </span>
          </div>

          <div>
            <h3 className="font-bold text-slate-900">
              Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
            </h3>
            <p className="text-blue-600 font-medium text-sm">
              {appointment.doctor?.specialty}
            </p>
            <p className="text-slate-600 text-sm mt-1">{appointment.title}</p>
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
            {appointmentDate.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MapPinIcon className="h-4 w-4" />
          <span>{isVideo ? "Video Call" : "CarePoint Medical Center"}</span>
        </div>
      </div>

      {appointment.description && (
        <div className="mb-4 p-3 bg-slate-50 rounded-lg">
          <p className="text-sm text-slate-600">{appointment.description}</p>
        </div>
      )}

      {showActions && (
        <div className="flex gap-3">
          <Button size="sm">
            {isVideo ? "Join Video Call" : "Get Directions"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onReschedule?.(appointment.id)}
          >
            Reschedule
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCancel?.(appointment.id)}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}
