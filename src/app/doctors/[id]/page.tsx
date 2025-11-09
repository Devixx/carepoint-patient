"use client";

import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeftIcon,
  MapPinIcon,
  ClockIcon,
  StarIcon,
  VideoCameraIcon,
  CalendarIcon,
  AcademicCapIcon,
  LanguageIcon,
  CheckBadgeIcon,
  EnvelopeIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { Button } from "../../components/ui/Button";
import CareLoader from "../../components/ui/CareLoader";
import BottomNavigation from "../../components/navigation/BottomNavigation";
import DesktopSidebar from "../../components/navigation/DesktopSidebar";
import { useDoctor, useDoctorAvailability } from "@/hooks/api";
import { useState } from "react";
import { Doctor, getNextVacation, isOnVacation, formatVacationDates } from "@/types/doctor";

export default function DoctorProfilePage() {
  const router = useRouter();
  const params = useParams();
  const doctorId = params.id as string;
  
  const { data: doctor, isLoading, isError } = useDoctor(doctorId);
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  
  const { data: todaySlots } = useDoctorAvailability(doctorId, today);
  const { data: tomorrowSlots } = useDoctorAvailability(doctorId, tomorrow);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const handleBookAppointment = (date?: string, time?: string) => {
    const params = new URLSearchParams({
      doctorId: doctorId,
    });
    if (date && time) {
      params.set('date', date);
      params.set('time', time);
    }
    router.push(`/appointments/new?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <DesktopSidebar />
        <div className="lg:ml-64">
          <main className="pb-20 lg:pb-8">
            <CareLoader variant="full" message="Loading doctor profile..." />
          </main>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  if (isError || !doctor) {
    return (
      <div className="min-h-screen bg-slate-50">
        <DesktopSidebar />
        <div className="lg:ml-64">
          <main className="pb-20 lg:pb-8">
            <div className="p-4 lg:p-8">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                <h3 className="font-bold text-red-900 mb-2">
                  Doctor not found
                </h3>
                <p className="text-red-700 mb-4">
                  The doctor profile you're looking for doesn't exist.
                </p>
                <Button onClick={() => router.push('/find-care')}>
                  Back to Find Care
                </Button>
              </div>
            </div>
          </main>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  const getEarliestSlots = () => {
    if (todaySlots?.availableSlots?.length) {
      return { date: today, label: 'Today', slots: todaySlots.availableSlots.slice(0, 4) };
    } else if (tomorrowSlots?.availableSlots?.length) {
      return { date: tomorrow, label: 'Tomorrow', slots: tomorrowSlots.availableSlots.slice(0, 4) };
    }
    return null;
  };

  const earliestAvailable = getEarliestSlots();
  const nextVacation = doctor ? getNextVacation(doctor as Doctor) : null;
  const doctorOnVacation = doctor ? isOnVacation(doctor as Doctor) : false;

  return (
    <div className="min-h-screen bg-slate-50">
      <DesktopSidebar />

      <div className="lg:ml-64">
        <main className="pb-20 lg:pb-8">
          <div className="p-4 lg:p-8 space-y-6">
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Back
            </Button>

            {/* Doctor Header Card */}
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-emerald-600 rounded-3xl p-8 text-white shadow-2xl">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="w-32 h-32 bg-white/20 backdrop-blur rounded-3xl flex items-center justify-center border-4 border-white/30">
                  <span className="text-white font-bold text-5xl">
                    {doctor.firstName?.[0]}
                    {doctor.lastName?.[0]}
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div>
                      <h1 className="text-4xl font-bold mb-2">
                        Dr. {doctor.firstName} {doctor.lastName}
                      </h1>
                      <p className="text-blue-100 text-xl mb-3">{doctor.specialty}</p>
                      
                      <div className="flex items-center gap-6 flex-wrap">
                        <div className="flex items-center gap-2">
                          {[...Array(5)].map((_, i) => (
                            <StarIconSolid
                              key={i}
                              className={`h-5 w-5 ${
                                i < 5 ? "text-yellow-300" : "text-white/30"
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-white font-semibold">
                            4.9 (127 reviews)
                          </span>
                        </div>
                        
                        {doctor.isActive && (
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500 rounded-full">
                            <CheckBadgeIcon className="h-5 w-5" />
                            <span className="font-medium">Verified</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <Button
                      onClick={() => handleBookAppointment()}
                      className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg px-8 py-3 text-lg font-semibold"
                    >
                      Book Appointment
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Main Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* About */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">About</h2>
                  <p className="text-slate-700 leading-relaxed">
                    {doctor.bio || `Dr. ${doctor.firstName} ${doctor.lastName} is a dedicated ${doctor.specialty} specialist with extensive experience in patient care. Committed to providing the highest quality medical services with a patient-centered approach.`}
                  </p>
                </div>

                {/* Education & Experience */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">
                    Education & Experience
                  </h2>
                  <div className="space-y-4">
                    {doctor.education && (
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <AcademicCapIcon className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">Education</h3>
                          <p className="text-slate-600">{doctor.education}</p>
                        </div>
                      </div>
                    )}
                    
                    {doctor.experience && (
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                            <CheckBadgeIcon className="h-6 w-6 text-emerald-600" />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">Experience</h3>
                          <p className="text-slate-600">{doctor.experience}</p>
                        </div>
                      </div>
                    )}

                    {doctor.licenseNumber && (
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                            <CheckBadgeIcon className="h-6 w-6 text-purple-600" />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">License Number</h3>
                          <p className="text-slate-600">{doctor.licenseNumber}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Languages */}
                {doctor.languages && doctor.languages.length > 0 && (
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Languages</h2>
                    <div className="flex flex-wrap gap-2">
                      {doctor.languages.map((lang: string, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full"
                        >
                          <LanguageIcon className="h-5 w-5 text-slate-600" />
                          <span className="font-medium text-slate-900">{lang}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Social Media */}
                {doctor.socialMedia && Object.values(doctor.socialMedia).some(val => val) && (
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Connect</h2>
                    <div className="flex flex-wrap gap-3">
                      {doctor.socialMedia.facebook && (
                        <a
                          href={doctor.socialMedia.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 px-4 py-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors group"
                        >
                          <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                          <span className="font-semibold text-blue-700 group-hover:text-blue-800">Facebook</span>
                        </a>
                      )}
                      {doctor.socialMedia.twitter && (
                        <a
                          href={doctor.socialMedia.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 px-4 py-3 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl transition-colors group"
                        >
                          <svg className="w-6 h-6 text-sky-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                          </svg>
                          <span className="font-semibold text-sky-700 group-hover:text-sky-800">Twitter</span>
                        </a>
                      )}
                      {doctor.socialMedia.linkedin && (
                        <a
                          href={doctor.socialMedia.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 px-4 py-3 bg-blue-50 hover:bg-blue-100 border border-blue-300 rounded-xl transition-colors group"
                        >
                          <svg className="w-6 h-6 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                          <span className="font-semibold text-blue-800 group-hover:text-blue-900">LinkedIn</span>
                        </a>
                      )}
                      {doctor.socialMedia.instagram && (
                        <a
                          href={doctor.socialMedia.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 px-4 py-3 bg-pink-50 hover:bg-pink-100 border border-pink-200 rounded-xl transition-colors group"
                        >
                          <svg className="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/>
                          </svg>
                          <span className="font-semibold text-pink-700 group-hover:text-pink-800">Instagram</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6">
                {/* Quick Info */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                  <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Info</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <ClockIcon className="h-5 w-5 text-slate-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-slate-600">Working Hours</p>
                        <p className="font-semibold text-slate-900">
                          {doctor.workingHours || "9:00 AM - 5:00 PM"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPinIcon className="h-5 w-5 text-slate-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-slate-600">Location</p>
                        <p className="font-semibold text-slate-900">
                          CarePoint Medical Center
                        </p>
                      </div>
                    </div>

                    {doctor.email && (
                      <div className="flex items-start gap-3">
                        <EnvelopeIcon className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-600">Email</p>
                          <p className="font-semibold text-slate-900 break-all">
                            {doctor.email}
                          </p>
                        </div>
                      </div>
                    )}

                    {doctor.phone && (
                      <div className="flex items-start gap-3">
                        <PhoneIcon className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-600">Phone</p>
                          <p className="font-semibold text-slate-900">{doctor.phone}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Next Vacation Card */}
                {nextVacation && (
                  <div className={`rounded-2xl p-6 shadow-lg border ${
                    doctorOnVacation 
                      ? 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-200' 
                      : 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200'
                  }`}>
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        doctorOnVacation ? 'bg-orange-100' : 'bg-amber-100'
                      }`}>
                        <CalendarIcon className={`h-6 w-6 ${
                          doctorOnVacation ? 'text-orange-600' : 'text-amber-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h2 className={`text-xl font-bold mb-1 ${
                          doctorOnVacation ? 'text-orange-900' : 'text-amber-900'
                        }`}>
                          {doctorOnVacation ? 'Currently on Vacation' : 'Upcoming Vacation'}
                        </h2>
                        <p className={`text-lg font-semibold ${
                          doctorOnVacation ? 'text-orange-700' : 'text-amber-700'
                        }`}>
                          {formatVacationDates(nextVacation)}
                        </p>
                        {nextVacation.reason && (
                          <p className={`text-sm mt-2 ${
                            doctorOnVacation ? 'text-orange-600' : 'text-amber-600'
                          }`}>
                            {nextVacation.reason}
                          </p>
                        )}
                      </div>
                    </div>
                    {doctorOnVacation && (
                      <div className="mt-4 pt-4 border-t border-orange-200">
                        <p className="text-sm text-orange-700 font-medium">
                          This doctor is currently unavailable. Please check back after their vacation ends.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Available Slots */}
                <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl p-6 shadow-lg border border-emerald-100">
                  <h2 className="text-xl font-bold text-slate-900 mb-4">
                    Next Available
                  </h2>
                  
                  {earliestAvailable ? (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <CalendarIcon className="h-5 w-5 text-emerald-600" />
                        <span className="font-semibold text-emerald-700 text-lg">
                          {earliestAvailable.label}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {earliestAvailable.slots.map((slot, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleBookAppointment(earliestAvailable.date, slot)}
                            className="px-4 py-3 bg-white border-2 border-emerald-200 rounded-xl text-sm font-semibold text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 transition-all"
                          >
                            {formatTime(slot)}
                          </button>
                        ))}
                      </div>
                      <Button
                        onClick={() => handleBookAppointment()}
                        variant="outline"
                        className="w-full mt-4"
                      >
                        View All Slots
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <CalendarIcon className="h-12 w-12 text-slate-300 mx-auto mb-2" />
                      <p className="text-slate-600 text-sm">
                        No slots available in the next 2 days
                      </p>
                      <Button
                        onClick={() => handleBookAppointment()}
                        variant="outline"
                        className="w-full mt-4"
                      >
                        Check Availability
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <BottomNavigation />
    </div>
  );
}

