"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  ArrowLeftIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { Button } from "../../components/ui/Button";
import BottomNavigation from "../../components/navigation/BottomNavigation";
import DesktopSidebar from "../../components/navigation/DesktopSidebar";
import {
  useDoctors,
  useDoctorAvailability,
  useCreateAppointment,
} from "@/hooks/api";

const appointmentTypes = [
  { id: "consultation", name: "General Consultation", duration: 30 },
  { id: "followup", name: "Follow-up Visit", duration: 20 },
  { id: "checkup", name: "Routine Checkup", duration: 45 },
  { id: "urgent", name: "Urgent Care", duration: 15 },
];

type BookingStep = "type" | "doctor" | "datetime" | "details" | "confirmation";

export default function NewAppointmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState<BookingStep>("type");
  const [bookingData, setBookingData] = useState({
    type: "",
    doctorId: "",
    date: "",
    time: "",
    reason: "",
    notes: "",
  });

  const { data: doctors = [] } = useDoctors();
  const { data: availability } = useDoctorAvailability(
    bookingData.doctorId,
    bookingData.date
  );
  const createAppointmentMutation = useCreateAppointment();

  const steps = [
    { id: "type", name: "Type", completed: !!bookingData.type },
    { id: "doctor", name: "Doctor", completed: !!bookingData.doctorId },
    {
      id: "datetime",
      name: "Date & Time",
      completed: !!bookingData.date && !!bookingData.time,
    },
    { id: "details", name: "Details", completed: !!bookingData.reason },
    { id: "confirmation", name: "Confirm", completed: false },
  ];

  const nextStep = () => {
    const stepOrder: BookingStep[] = [
      "type",
      "doctor",
      "datetime",
      "details",
      "confirmation",
    ];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const stepOrder: BookingStep[] = [
      "type",
      "doctor",
      "datetime",
      "details",
      "confirmation",
    ];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  // In the handleBooking function, change doctorId to doctorUserId:

  const handleBooking = async () => {
    const selectedType = appointmentTypes.find(
      (t) => t.id === bookingData.type
    );
    if (!selectedType) return;

    const startTime = new Date(
      `${bookingData.date}T${bookingData.time}:00.000Z`
    );
    const endTime = new Date(
      startTime.getTime() + selectedType.duration * 60000
    );

    try {
      await createAppointmentMutation.mutateAsync({
        doctorUserId: bookingData.doctorId, // Changed from doctorId to doctorUserId
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        type: bookingData.type,
        title: bookingData.reason,
        description: bookingData.notes || undefined,
      });

      router.push("/appointments?booked=true");
    } catch (error) {
      console.error("Booking failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <DesktopSidebar />

      <div className="lg:ml-64">
        <main className="pb-20 lg:pb-8">
          <div className="p-4 lg:p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => router.back()}>
                <ArrowLeftIcon className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Book New Appointment
                </h1>
                <p className="text-slate-600">
                  Schedule your next healthcare visit
                </p>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
              <div className="flex items-center justify-between mb-8">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                        step.completed
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : currentStep === step.id
                          ? "border-blue-500 text-blue-500 bg-blue-50"
                          : "border-slate-300 text-slate-400"
                      }`}
                    >
                      {step.completed ? (
                        <CheckIcon className="h-5 w-5" />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-16 h-0.5 ml-4 ${
                          step.completed ? "bg-emerald-500" : "bg-slate-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              <h2 className="text-xl font-semibold mb-6">
                {steps.find((s) => s.id === currentStep)?.name}
              </h2>

              {/* Step Content */}
              <div className="min-h-[400px]">
                {currentStep === "type" && (
                  <div className="space-y-4">
                    <p className="text-slate-600 mb-6">
                      What type of appointment do you need?
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {appointmentTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() =>
                            setBookingData({ ...bookingData, type: type.id })
                          }
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            bookingData.type === type.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <h3 className="font-semibold mb-1">{type.name}</h3>
                          <p className="text-sm text-slate-600">
                            {type.duration} minutes
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === "doctor" && (
                  <div className="space-y-4">
                    <p className="text-slate-600 mb-6">Choose your doctor</p>
                    <div className="space-y-4">
                      {doctors.map((doctor) => (
                        <button
                          key={doctor.id}
                          onClick={() =>
                            setBookingData({
                              ...bookingData,
                              doctorId: doctor.id,
                            })
                          }
                          className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                            bookingData.doctorId === doctor.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                              <UserIcon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold">
                                Dr. {doctor.firstName} {doctor.lastName}
                              </h3>
                              <p className="text-sm text-slate-600">
                                {doctor.specialty}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === "datetime" && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Select Date
                      </label>
                      <input
                        type="date"
                        value={bookingData.date}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            date: e.target.value,
                            time: "",
                          })
                        }
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {bookingData.date && availability && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Select Time
                        </label>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                          {availability.availableSlots.map((time) => (
                            <button
                              key={time}
                              onClick={() =>
                                setBookingData({ ...bookingData, time })
                              }
                              className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                                bookingData.time === time
                                  ? "border-blue-500 bg-blue-50 text-blue-700"
                                  : "border-slate-200 hover:border-slate-300"
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                        {availability.availableSlots.length === 0 && (
                          <p className="text-slate-500 text-sm">
                            No available slots for this date
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {currentStep === "details" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Reason for visit *
                      </label>
                      <input
                        type="text"
                        value={bookingData.reason}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            reason: e.target.value,
                          })
                        }
                        placeholder="Brief description of your concern"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Additional notes (optional)
                      </label>
                      <textarea
                        value={bookingData.notes}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            notes: e.target.value,
                          })
                        }
                        placeholder="Any additional information for your doctor"
                        rows={4}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}

                {currentStep === "confirmation" && (
                  <div className="space-y-6">
                    <div className="bg-slate-50 rounded-xl p-6">
                      <h3 className="font-semibold mb-4">
                        Appointment Summary
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Type:</span>
                          <span>
                            {
                              appointmentTypes.find(
                                (t) => t.id === bookingData.type
                              )?.name
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Doctor:</span>
                          <span>
                            Dr.{" "}
                            {
                              doctors.find((d) => d.id === bookingData.doctorId)
                                ?.firstName
                            }{" "}
                            {
                              doctors.find((d) => d.id === bookingData.doctorId)
                                ?.lastName
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Date:</span>
                          <span>
                            {new Date(bookingData.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Time:</span>
                          <span>{bookingData.time}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Reason:</span>
                          <span>{bookingData.reason}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                      <p className="text-sm text-blue-800">
                        <strong>Please note:</strong> You will receive a
                        confirmation email shortly after booking. Arrive 15
                        minutes early for your appointment.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === "type"}
                >
                  Previous
                </Button>

                <Button
                  onClick={
                    currentStep === "confirmation" ? handleBooking : nextStep
                  }
                  isLoading={createAppointmentMutation.isPending}
                  disabled={
                    (currentStep === "type" && !bookingData.type) ||
                    (currentStep === "doctor" && !bookingData.doctorId) ||
                    (currentStep === "datetime" &&
                      (!bookingData.date || !bookingData.time)) ||
                    (currentStep === "details" && !bookingData.reason)
                  }
                >
                  {currentStep === "confirmation" ? "Book Appointment" : "Next"}
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>

      <BottomNavigation />
    </div>
  );
}
