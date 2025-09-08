"use client";

import { useState } from "react";
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  StarIcon,
  ClockIcon,
  VideoCameraIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { Button } from "../components/ui/Button";
import CareLoader from "../components/ui/CareLoader";
import BottomNavigation from "../components/navigation/BottomNavigation";
import DesktopSidebar from "../components/navigation/DesktopSidebar";
import { useDoctors } from "@/hooks/api";

const specialties = [
  "All Specialties",
  "Cardiology",
  "Dermatology",
  "Internal Medicine",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
];

export default function FindCarePage() {
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: doctors = [],
    isLoading,
    isError,
    error,
  } = useDoctors({
    specialty: selectedSpecialty,
    search: searchQuery,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <DesktopSidebar />
        <div className="lg:ml-64">
          <main className="pb-20 lg:pb-8">
            <CareLoader variant="full" message="Finding doctors for you..." />
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
                  Failed to load doctors
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

  return (
    <div className="min-h-screen bg-slate-50">
      <DesktopSidebar />

      <div className="lg:ml-64">
        <main className="pb-20 lg:pb-8">
          <div className="p-4 lg:p-8 space-y-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl p-6 text-white">
              <h1 className="text-3xl font-bold mb-2">Find Your Doctor</h1>
              <p className="text-blue-100 text-lg">
                Discover healthcare professionals near you
              </p>
            </div>

            {/* Search & Filters */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
              <div className="space-y-4">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by doctor name or specialty..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {specialties.map((specialty) => (
                    <button
                      key={specialty}
                      onClick={() => setSelectedSpecialty(specialty)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                        selectedSpecialty === specialty
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {specialty}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">
                  {doctors.length} doctors available
                </h2>
                <select className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>Sort by availability</option>
                  <option>Sort by rating</option>
                  <option>Sort by distance</option>
                </select>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {doctors.map((doctor) => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))}
              </div>

              {doctors.length === 0 && (
                <div className="text-center py-12">
                  <MagnifyingGlassIcon className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    No doctors found
                  </h3>
                  <p className="text-slate-500">
                    Try adjusting your search criteria
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <BottomNavigation />
    </div>
  );
}

function DoctorCard({ doctor }: { doctor: any }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow duration-200">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-lg">
            {doctor.firstName?.[0]}
            {doctor.lastName?.[0]}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Dr. {doctor.firstName} {doctor.lastName}
              </h3>
              <p className="text-blue-600 font-medium">{doctor.specialty}</p>
            </div>
            {doctor.acceptsVideo && (
              <div className="flex items-center gap-1 px-2 py-1 bg-emerald-100 rounded-full">
                <VideoCameraIcon className="h-3 w-3 text-emerald-600" />
                <span className="text-xs text-emerald-600 font-medium">
                  Video
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <StarIconSolid
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(4.8) ? "text-yellow-400" : "text-slate-200"
                  }`}
                />
              ))}
              <span className="text-sm font-medium text-slate-700 ml-1">
                4.8 (89 reviews)
              </span>
            </div>
          </div>

          <div className="space-y-2 text-sm text-slate-600 mb-4">
            <div className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4" />
              <span>{doctor.workingHours || "9:00 AM - 5:00 PM"}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPinIcon className="h-4 w-4" />
              <span>CarePoint Medical Center</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-emerald-500" />
              <span className="text-emerald-600 font-medium">
                Available today
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              className="flex-1"
              onClick={() => (window.location.href = "/appointments/new")}
            >
              Book Appointment
            </Button>
            <Button variant="outline">View Profile</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
