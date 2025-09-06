"use client";

import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { Button } from "../ui/Button";
import { useFakeAuth } from "../../contexts/FakeAuthContext";

export function WelcomeCard() {
  const { patient } = useFakeAuth();

  const nextAppointment = {
    doctor: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    date: "Tomorrow",
    time: "2:30 PM",
    location: "CarePoint Medical Center",
  };

  return (
    <div className="card p-6 bg-gradient-to-br from-brand-blue to-blue-700 text-white">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-2">
            Good afternoon, {patient?.firstName}! 👋
          </h2>
          <p className="text-blue-100 mb-4">
            Your next appointment is coming up soon
          </p>

          {nextAppointment && (
            <div className="space-y-2 text-sm text-blue-100">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                <span>
                  {nextAppointment.date} at {nextAppointment.time}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="h-4 w-4" />
                <span>
                  {nextAppointment.doctor} - {nextAppointment.specialty}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-4 w-4" />
                <span>{nextAppointment.location}</span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            View Details
          </Button>
          <Button className="bg-white text-brand-blue hover:bg-gray-50">
            Reschedule
          </Button>
        </div>
      </div>
    </div>
  );
}
