"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  ArrowLeftIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
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

type BookingStep = "doctor" | "datetime" | "type" | "details" | "confirmation";

export default function NewAppointmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get URL parameters
  const prefilledDoctorId = searchParams.get('doctorId');
  const prefilledDate = searchParams.get('date');
  const prefilledTime = searchParams.get('time');
  
  // Determine initial step - if we have doctor, date, and time, skip to type selection
  const getInitialStep = (): BookingStep => {
    if (prefilledDoctorId && prefilledDate && prefilledTime) {
      return "type";
    }
    return "doctor";
  };
  
  const [currentStep, setCurrentStep] = useState<BookingStep>(getInitialStep());
  const [bookingData, setBookingData] = useState({
    type: "",
    doctorId: prefilledDoctorId || "",
    date: prefilledDate || "",
    time: prefilledTime || "",
    reason: "",
    notes: "",
  });
  
  // Calendar view state
  const [viewingDate, setViewingDate] = useState<string>(
    prefilledDate || new Date().toISOString().split('T')[0]
  );

  const { data: doctors = [] } = useDoctors();
  const { data: availability } = useDoctorAvailability(
    bookingData.doctorId,
    viewingDate
  );
  const createAppointmentMutation = useCreateAppointment();
  
  // Find first available date when doctor is selected
  useEffect(() => {
    if (bookingData.doctorId && !prefilledDate && currentStep === "datetime") {
      // Start checking from today
      const today = new Date().toISOString().split('T')[0];
      setViewingDate(today);
    }
  }, [bookingData.doctorId, currentStep, prefilledDate]);
  
  // Auto-navigate to next available day if current day has no slots
  useEffect(() => {
    if (
      currentStep === "datetime" &&
      bookingData.doctorId &&
      availability &&
      availability.availableSlots.length === 0
    ) {
      // If no slots today and it's automatically selected, try tomorrow
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      
      if (viewingDate === today && !bookingData.date) {
        // Auto-advance to next day to help find available slots
        // But only do this once on initial load
        setTimeout(() => {
          if (!bookingData.date) {
            setViewingDate(tomorrowStr);
          }
        }, 500);
      }
    }
  }, [availability, currentStep, bookingData.doctorId, bookingData.date, viewingDate]);
  
  // Date navigation helpers
  const changeDay = (direction: 'prev' | 'next') => {
    // Parse the date string properly to avoid timezone issues
    const [year, month, day] = viewingDate.split('-').map(Number);
    const currentDate = new Date(year, month - 1, day); // month is 0-indexed
    
    // Create new date by adding/subtracting days
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    
    // Get today's date at midnight for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Don't allow going before today
    if (newDate >= today) {
      // Format as YYYY-MM-DD
      const newYear = newDate.getFullYear();
      const newMonth = String(newDate.getMonth() + 1).padStart(2, '0');
      const newDay = String(newDate.getDate()).padStart(2, '0');
      setViewingDate(`${newYear}-${newMonth}-${newDay}`);
    }
  };
  
  const formatDisplayDate = (dateStr: string) => {
    // Parse date string properly to avoid timezone issues
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const compareDate = new Date(year, month - 1, day);
    
    if (compareDate.getTime() === today.getTime()) return 'Today';
    if (compareDate.getTime() === tomorrow.getTime()) return 'Tomorrow';
    
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const formatTimeSlot = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };
  
  const isViewingToday = () => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    return viewingDate === todayStr;
  };

  const steps = [
    { id: "doctor", name: "Doctor", completed: !!bookingData.doctorId },
    {
      id: "datetime",
      name: "Date & Time",
      completed: !!bookingData.date && !!bookingData.time,
    },
    { id: "type", name: "Type", completed: !!bookingData.type },
    { id: "details", name: "Details", completed: !!bookingData.reason },
    { id: "confirmation", name: "Confirm", completed: false },
  ];

  const nextStep = () => {
    const stepOrder: BookingStep[] = [
      "doctor",
      "datetime",
      "type",
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
      "doctor",
      "datetime",
      "type",
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
      // Debug: Check authentication before booking
      const token = localStorage.getItem("patient-token");
      console.log("🔐 Booking appointment - Auth check:", {
        hasToken: !!token,
        tokenPreview: token ? token.substring(0, 20) + "..." : "none",
      });

      await createAppointmentMutation.mutateAsync({
        doctorUserId: bookingData.doctorId, // Changed from doctorId to doctorUserId
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        type: bookingData.type,
        title: bookingData.reason,
        description: bookingData.notes || undefined,
      });

      router.push("/appointments?booked=true");
    } catch (error: any) {
      console.error("Booking failed:", error);
      
      // Handle authentication errors
      if (error?.status === 401) {
        alert("Your session has expired. Please log in again.");
        localStorage.removeItem("patient-token");
        router.push("/login");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <DesktopSidebar />

      <div className="lg:ml-64">
        <main className="pb-20 lg:pb-8">
          <div className="p-3 sm:p-4 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Header */}
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.back()} className="flex-shrink-0">
                <ArrowLeftIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 truncate">
                  Book New Appointment
                </h1>
                <p className="text-xs sm:text-sm lg:text-base text-slate-600 truncate">
                  Schedule your next healthcare visit
                </p>
              </div>
            </div>

            {/* Pre-filled Info Banner */}
            {prefilledDoctorId && prefilledDate && prefilledTime && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-emerald-800 flex items-start sm:items-center gap-2">
                  <CheckIcon className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 flex-shrink-0 mt-0.5 sm:mt-0" />
                  <span>
                    <strong>Great choice!</strong> Your doctor and time slot have been selected. 
                    Just choose appointment type and add details to complete booking.
                  </span>
                </p>
              </div>
            )}

            {/* Progress Steps */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-lg border border-slate-100">
              {/* Mobile compact steps */}
              <div className="sm:hidden flex items-center justify-between mb-4 overflow-x-auto pb-2">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center flex-shrink-0">
                    <div
                      className={`flex items-center justify-center w-7 h-7 rounded-full border-2 transition-colors ${
                        step.completed
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : currentStep === step.id
                          ? "border-blue-500 text-blue-500 bg-blue-50"
                          : "border-slate-300 text-slate-400"
                      }`}
                    >
                      {step.completed ? (
                        <CheckIcon className="h-3.5 w-3.5" />
                      ) : (
                        <span className="text-xs font-medium">{index + 1}</span>
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-8 h-0.5 mx-1 ${
                          step.completed ? "bg-emerald-500" : "bg-slate-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Desktop steps */}
              <div className="hidden sm:flex items-center justify-between mb-6 lg:mb-8">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 transition-colors ${
                        step.completed
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : currentStep === step.id
                          ? "border-blue-500 text-blue-500 bg-blue-50"
                          : "border-slate-300 text-slate-400"
                      }`}
                    >
                      {step.completed ? (
                        <CheckIcon className="h-4 w-4 lg:h-5 lg:w-5" />
                      ) : (
                        <span className="text-xs lg:text-sm font-medium">{index + 1}</span>
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-12 lg:w-16 h-0.5 ml-2 lg:ml-4 ${
                          step.completed ? "bg-emerald-500" : "bg-slate-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              <h2 className="text-base sm:text-lg lg:text-xl font-semibold mb-4 sm:mb-6">
                {steps.find((s) => s.id === currentStep)?.name}
              </h2>

              {/* Selected Values Display */}
              {(bookingData.doctorId || bookingData.date || bookingData.type) && (
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-slate-50 rounded-lg sm:rounded-xl border border-slate-200">
                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-3 lg:gap-4 text-xs sm:text-sm">
                    {bookingData.doctorId && (
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <UserIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 flex-shrink-0" />
                        <span className="text-slate-600 whitespace-nowrap">Doctor:</span>
                        <span className="font-semibold text-slate-900 truncate">
                          Dr. {doctors.find((d) => d.id === bookingData.doctorId)?.firstName}{" "}
                          {doctors.find((d) => d.id === bookingData.doctorId)?.lastName}
                        </span>
                      </div>
                    )}
                    {bookingData.date && bookingData.time && (
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <CalendarIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600 flex-shrink-0" />
                        <span className="text-slate-600 whitespace-nowrap">Date & Time:</span>
                        <span className="font-semibold text-slate-900 truncate">
                          {new Date(bookingData.date).toLocaleDateString('en-US', { 
                            weekday: 'short',
                            month: 'short', 
                            day: 'numeric' 
                          })} at {bookingData.time}
                        </span>
                      </div>
                    )}
                    {bookingData.type && (
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <ClockIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600 flex-shrink-0" />
                        <span className="text-slate-600 whitespace-nowrap">Type:</span>
                        <span className="font-semibold text-slate-900 truncate">
                          {appointmentTypes.find((t) => t.id === bookingData.type)?.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step Content */}
              <div className="min-h-[300px] sm:min-h-[400px]">
                {currentStep === "doctor" && (
                  <div className="space-y-3 sm:space-y-4">
                    <p className="text-xs sm:text-sm text-slate-600 mb-3 sm:mb-6">Choose your doctor</p>
                    <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                      {doctors.map((doctor) => (
                        <button
                          key={doctor.id}
                          onClick={() =>
                            setBookingData({
                              ...bookingData,
                              doctorId: doctor.id,
                            })
                          }
                          className={`w-full p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 text-left transition-all ${
                            bookingData.doctorId === doctor.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center gap-3 sm:gap-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <UserIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-sm sm:text-base font-semibold truncate">
                                Dr. {doctor.firstName} {doctor.lastName}
                              </h3>
                              <p className="text-xs sm:text-sm text-slate-600 truncate">
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
                  <div className="space-y-4 sm:space-y-6">
                    {/* Calendar Day Navigation */}
                    <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-100">
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <button
                          onClick={() => changeDay('prev')}
                          disabled={isViewingToday()}
                          className="p-1.5 sm:p-2 rounded-lg hover:bg-white/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          title="Previous day"
                        >
                          <ChevronLeftIcon className="h-5 w-5 sm:h-6 sm:w-6 text-slate-700" />
                        </button>
                        
                        <div className="text-center min-w-0 px-2">
                          <h3 className="text-sm sm:text-base lg:text-xl font-bold text-slate-900 truncate">
                            {formatDisplayDate(viewingDate)}
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-600">
                            {availability?.availableSlots?.length || 0} slots
                          </p>
                        </div>
                        
                        <button
                          onClick={() => changeDay('next')}
                          className="p-1.5 sm:p-2 rounded-lg hover:bg-white/50 transition-colors"
                          title="Next day"
                        >
                          <ChevronRightIcon className="h-5 w-5 sm:h-6 sm:w-6 text-slate-700" />
                        </button>
                      </div>
                      
                      {/* Manual Date Picker */}
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600 flex-shrink-0" />
                        <input
                          type="date"
                          value={viewingDate}
                          onChange={(e) => {
                            setViewingDate(e.target.value);
                            setBookingData({
                              ...bookingData,
                              date: "",
                              time: "",
                            });
                          }}
                          min={new Date().toISOString().split("T")[0]}
                          className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        />
                      </div>
                    </div>

                    {/* Available Time Slots */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-2 sm:mb-3">
                        Select Time Slot
                      </label>
                      
                      {availability && availability.availableSlots.length > 0 ? (
                        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-3">
                          {availability.availableSlots.map((time) => (
                            <button
                              key={time}
                              onClick={() => {
                                setBookingData({
                                  ...bookingData,
                                  date: viewingDate,
                                  time: time
                                });
                              }}
                              className={`p-2 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl border-2 text-center transition-all ${
                                bookingData.date === viewingDate && bookingData.time === time
                                  ? "border-blue-500 bg-blue-50 shadow-md"
                                  : "border-slate-200 hover:border-blue-300 hover:bg-blue-50/50"
                              }`}
                            >
                              <div className="text-sm sm:text-base lg:text-lg font-semibold text-slate-900">
                                {formatTimeSlot(time)}
                              </div>
                              {bookingData.date === viewingDate && bookingData.time === time && (
                                <div className="flex items-center justify-center mt-0.5 sm:mt-1">
                                  <CheckIcon className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 sm:py-12 bg-slate-50 rounded-lg sm:rounded-xl border border-slate-200">
                          <CalendarIcon className="h-8 w-8 sm:h-12 sm:w-12 text-slate-300 mx-auto mb-2 sm:mb-3" />
                          <p className="text-sm sm:text-base text-slate-600 font-medium px-4">
                            No available slots for this date
                          </p>
                          <p className="text-xs sm:text-sm text-slate-500 mt-1 sm:mt-2 mb-3 sm:mb-4 px-4">
                            Try selecting a different day
                          </p>
                          <button
                            onClick={() => changeDay('next')}
                            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Check Next Day
                            <ChevronRightIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {currentStep === "type" && (
                  <div className="space-y-3 sm:space-y-4">
                    <p className="text-xs sm:text-sm text-slate-600 mb-3 sm:mb-6">
                      What type of appointment do you need?
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
                      {appointmentTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() =>
                            setBookingData({ ...bookingData, type: type.id })
                          }
                          className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 text-left transition-all ${
                            bookingData.type === type.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <h3 className="text-sm sm:text-base font-semibold mb-0.5 sm:mb-1">{type.name}</h3>
                          <p className="text-xs sm:text-sm text-slate-600">
                            {type.duration} minutes
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === "details" && (
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
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
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
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
                        rows={3}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
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
              <div className="flex justify-between gap-2 sm:gap-3 mt-6 sm:mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevStep}
                  disabled={currentStep === "doctor"}
                  className="px-4 sm:px-6"
                >
                  <span className="hidden xs:inline">Previous</span>
                  <span className="xs:hidden">Back</span>
                </Button>

                <Button
                  size="sm"
                  onClick={
                    currentStep === "confirmation" ? handleBooking : nextStep
                  }
                  isLoading={createAppointmentMutation.isPending}
                  disabled={
                    (currentStep === "doctor" && !bookingData.doctorId) ||
                    (currentStep === "datetime" &&
                      (!bookingData.date || !bookingData.time)) ||
                    (currentStep === "type" && !bookingData.type) ||
                    (currentStep === "details" && !bookingData.reason)
                  }
                  className="px-4 sm:px-6"
                >
                  {currentStep === "confirmation" ? (
                    <>
                      <span className="hidden xs:inline">Book Appointment</span>
                      <span className="xs:hidden">Book</span>
                    </>
                  ) : (
                    "Next"
                  )}
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
