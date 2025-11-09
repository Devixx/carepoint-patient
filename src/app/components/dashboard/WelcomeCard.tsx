"use client";

import { useState } from "react";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { Button } from "../ui/Button";
// import { useFakeAuth } from "../../contexts/FakeAuthContext";
import { useAuth } from "@/app/contexts/AuthContext";

export function WelcomeCard() {
  const { patient } = useAuth();
  const [showDetails, setShowDetails] = useState(false);

  const nextAppointment = {
    id: "1",
    doctor: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    date: "Tomorrow",
    time: "2:30 PM",
    location: "CarePoint Medical Center",
    notes: "Please arrive 15 minutes early for check-in",
    reason: "Regular checkup",
  };

  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 text-white shadow-xl">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-5 lg:gap-0">
        <div className="flex-1">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-1 sm:mb-2">
            Good afternoon, {patient?.firstName}! 👋
          </h2>
          <p className="text-blue-100 mb-4 sm:mb-5 lg:mb-6 text-sm sm:text-base lg:text-lg">
            Your healthcare journey continues
          </p>

          {nextAppointment && (
            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-5 lg:mb-6">
              <h3 className="text-sm sm:text-base font-semibold text-blue-100">Next Appointment</h3>
              <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <div className="flex items-center gap-2 sm:gap-3">
                  <CalendarIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-200 flex-shrink-0" />
                  <span>
                    {nextAppointment.date} at {nextAppointment.time}
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <ClockIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-200 flex-shrink-0" />
                  <span className="truncate">
                    {nextAppointment.doctor} - {nextAppointment.specialty}
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <MapPinIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-200 flex-shrink-0" />
                  <span className="truncate">{nextAppointment.location}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-row gap-2 sm:gap-3 lg:ml-8 lg:flex-col">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 lg:flex-none bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm text-xs sm:text-sm"
            onClick={() => setShowDetails(true)}
          >
            <span className="hidden xs:inline">View Details</span>
            <span className="xs:hidden">Details</span>
          </Button>
          <Button
            size="sm"
            className="flex-1 lg:flex-none bg-white text-blue-700 hover:bg-blue-50 font-semibold text-xs sm:text-sm"
            onClick={() => (window.location.href = "/appointments")}
          >
            Reschedule
          </Button>
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 max-w-md w-full">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 sm:mb-4">
              Appointment Details
            </h3>

            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-slate-600 mb-4 sm:mb-6">
              <div>
                <strong>Doctor:</strong> {nextAppointment.doctor}
              </div>
              <div>
                <strong>Specialty:</strong> {nextAppointment.specialty}
              </div>
              <div>
                <strong>Date & Time:</strong> {nextAppointment.date} at{" "}
                {nextAppointment.time}
              </div>
              <div>
                <strong>Location:</strong> {nextAppointment.location}
              </div>
              <div>
                <strong>Reason:</strong> {nextAppointment.reason}
              </div>
              <div>
                <strong>Notes:</strong> {nextAppointment.notes}
              </div>
            </div>

            <div className="flex gap-2 sm:gap-3">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs sm:text-sm"
                onClick={() => setShowDetails(false)}
              >
                Close
              </Button>
              <Button
                size="sm"
                className="flex-1 text-xs sm:text-sm"
                onClick={() => (window.location.href = "/appointments")}
              >
                Manage
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
