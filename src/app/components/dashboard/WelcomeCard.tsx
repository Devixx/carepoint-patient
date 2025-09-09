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
    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2">
            Good afternoon, {patient?.firstName}! 👋
          </h2>
          <p className="text-blue-100 mb-6 text-lg">
            Your healthcare journey continues
          </p>

          {nextAppointment && (
            <div className="space-y-3 mb-6">
              <h3 className="font-semibold text-blue-100">Next Appointment</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3">
                  <CalendarIcon className="h-4 w-4 text-blue-200" />
                  <span>
                    {nextAppointment.date} at {nextAppointment.time}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <ClockIcon className="h-4 w-4 text-blue-200" />
                  <span>
                    {nextAppointment.doctor} - {nextAppointment.specialty}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPinIcon className="h-4 w-4 text-blue-200" />
                  <span>{nextAppointment.location}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 lg:ml-8">
          <Button
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
            onClick={() => setShowDetails(true)}
          >
            View Details
          </Button>
          <Button
            className="bg-white text-blue-700 hover:bg-blue-50 font-semibold"
            onClick={() => (window.location.href = "/appointments")}
          >
            Reschedule
          </Button>
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              Appointment Details
            </h3>

            <div className="space-y-3 text-sm text-slate-600 mb-6">
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

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowDetails(false)}
              >
                Close
              </Button>
              <Button
                className="flex-1"
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
