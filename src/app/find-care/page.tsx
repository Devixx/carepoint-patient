"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  StarIcon,
  ClockIcon,
  VideoCameraIcon,
  CalendarIcon,
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { 
  StarIcon as StarIconSolid,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/solid";
import { Button } from "../components/ui/Button";
import CareLoader from "../components/ui/CareLoader";
import BottomNavigation from "../components/navigation/BottomNavigation";
import DesktopSidebar from "../components/navigation/DesktopSidebar";
import { useDoctors, useDoctorAvailability, usePatientAppointments } from "@/hooks/api";
import { Doctor, getNextVacation, isOnVacation, formatVacationDates } from "@/types/doctor";

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
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    availableOnly: false,
  });

  const {
    data: doctors = [],
    isLoading,
    isError,
    error,
  } = useDoctors({
    specialty: selectedSpecialty,
    search: searchQuery,
  });

  // Fetch patient's appointments to identify their medical team
  const { data: appointmentsData } = usePatientAppointments();
  const appointments = appointmentsData?.items || [];
  
  // Debug logging to see what data we're getting
  console.log("🔍 Appointments data:", {
    totalAppointments: appointments.length,
    sampleAppointment: appointments[0],
    doctorFields: appointments[0]?.doctor ? Object.keys(appointments[0].doctor) : 'no doctor',
  });
  
  // Get unique doctor IDs from past appointments
  // Try multiple possible ID fields: userId, id, doctorUserId
  const myDoctorIds = new Set(
    appointments
      .filter((apt) => apt.status === "completed" || new Date(apt.startTime) < new Date())
      .map((apt) => {
        // Try different possible ID fields
        const doctorId = apt.doctor?.userId || apt.doctor?.id || apt.doctorUserId;
        console.log("📋 Appointment doctor ID:", {
          userId: apt.doctor?.userId,
          id: apt.doctor?.id,
          doctorUserId: apt.doctorUserId,
          resolved: doctorId,
          doctorName: `${apt.doctor?.firstName} ${apt.doctor?.lastName}`
        });
        return doctorId;
      })
      .filter(Boolean)
  );

  console.log("👥 My doctor IDs:", Array.from(myDoctorIds));
  console.log("👨‍⚕️ Sample doctor from list:", doctors[0] ? {
    id: doctors[0].id,
    userId: doctors[0].userId,
    name: `${doctors[0].firstName} ${doctors[0].lastName}`
  } : 'no doctors');

  // Categorize and sort doctors
  const categorizedDoctors = doctors.reduce((acc: { myTeam: any[], recommended: any[], others: any[] }, doctor: any) => {
    // Check multiple possible ID fields
    const doctorId = doctor.id || doctor.userId;
    const isMyDoctor = myDoctorIds.has(doctorId);
    
    if (isMyDoctor) {
      console.log("✅ Found my doctor:", doctor.firstName, doctor.lastName);
      acc.myTeam.push(doctor);
    } else if (doctor.rating >= 4.8 || doctor.featured) {
      acc.recommended.push(doctor);
    } else {
      acc.others.push(doctor);
    }
    return acc;
  }, { myTeam: [], recommended: [], others: [] });

  console.log("📊 Categorized doctors:", {
    myTeam: categorizedDoctors.myTeam.length,
    recommended: categorizedDoctors.recommended.length,
    others: categorizedDoctors.others.length
  });

  const sortedDoctors = [
    ...categorizedDoctors.myTeam,
    ...categorizedDoctors.recommended,
    ...categorizedDoctors.others
  ];

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
          <div className="p-3 sm:p-4 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 text-white">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">Find Your Doctor</h1>
              <p className="text-blue-100 text-sm sm:text-base lg:text-lg">
                Discover healthcare professionals near you
              </p>
            </div>

            {/* Search & Filters */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-lg border border-slate-100">
              <div className="space-y-3 sm:space-y-4">
                {/* Search Bar with Filter Toggle */}
                <div className="flex gap-2 sm:gap-3">
                  <div className="relative flex-1 min-w-0">
                    <MagnifyingGlassIcon className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search doctors..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-2.5 lg:py-3 text-sm sm:text-base border border-slate-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                    />
                  </div>
                  <Button
                    onClick={() => setShowFilters(!showFilters)}
                    variant="outline"
                    size="sm"
                    className={`flex-shrink-0 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 ${showFilters ? 'bg-blue-50 border-blue-500' : ''}`}
                  >
                    <FunnelIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="hidden xs:inline sm:inline">Filters</span>
                  </Button>
                </div>

                {/* Advanced Filters Panel */}
                {showFilters && (
                  <div className="p-3 sm:p-4 bg-slate-50 rounded-lg sm:rounded-xl border border-slate-200 space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm sm:text-base font-semibold text-slate-900">Advanced Filters</h3>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="text-slate-500 hover:text-slate-700 p-1"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
                          Available From
                        </label>
                        <input
                          type="date"
                          value={filters.dateFrom}
                          onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
                          Available Until
                        </label>
                        <input
                          type="date"
                          value={filters.dateTo}
                          onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                          min={filters.dateFrom || new Date().toISOString().split('T')[0]}
                          className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        id="availableOnly"
                        checked={filters.availableOnly}
                        onChange={(e) => setFilters({ ...filters, availableOnly: e.target.checked })}
                        className="w-4 h-4 mt-0.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="availableOnly" className="text-xs sm:text-sm font-medium text-slate-700">
                        Show only doctors with available slots
                      </label>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => setFilters({ dateFrom: "", dateTo: "", availableOnly: false })}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </div>
                )}

                {/* Specialty Filters */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {specialties.map((specialty) => (
                    <button
                      key={specialty}
                      onClick={() => setSelectedSpecialty(specialty)}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                        selectedSpecialty === specialty
                          ? "bg-blue-600 text-white shadow-sm"
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
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-3 sm:gap-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900">
                    <span className="hidden xs:inline">{sortedDoctors.length} doctors available</span>
                    <span className="xs:hidden">{sortedDoctors.length} results</span>
                  </h2>
                  {categorizedDoctors.myTeam.length > 0 && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      {categorizedDoctors.myTeam.length} in your team
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* View Toggle */}
                  <div className="flex items-center gap-0.5 sm:gap-1 p-0.5 sm:p-1 bg-slate-100 rounded-lg">
                    <button
                      onClick={() => setViewMode('card')}
                      className={`p-1.5 sm:p-2 rounded transition-colors ${
                        viewMode === 'card'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                      title="Card view"
                    >
                      <Squares2X2Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-1.5 sm:p-2 rounded transition-colors ${
                        viewMode === 'list'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                      title="List view"
                    >
                      <ListBulletIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </div>
                  
                  <select className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Availability</option>
                    <option>Rating</option>
                    <option>Distance</option>
                  </select>
                </div>
              </div>

              {/* My Medical Team Section */}
              {categorizedDoctors.myTeam.length > 0 && (
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base lg:text-lg font-bold text-slate-900">
                      My Medical Team
                    </h3>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-full border border-blue-200">
                      {categorizedDoctors.myTeam.length}
                    </span>
                  </div>
                  <div className={viewMode === 'card' ? "grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6" : "space-y-3 sm:space-y-4"}>
                    {categorizedDoctors.myTeam.map((doctor) => (
                      viewMode === 'card' ? (
                        <DoctorCard key={doctor.id} doctor={doctor} badge="myTeam" />
                      ) : (
                        <DoctorListItem key={doctor.id} doctor={doctor} badge="myTeam" />
                      )
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Section */}
              {categorizedDoctors.recommended.length > 0 && (
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base lg:text-lg font-bold text-slate-900">
                      Recommended for You
                    </h3>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-xs font-medium rounded-full border border-emerald-200">
                      {categorizedDoctors.recommended.length}
                    </span>
                  </div>
                  <div className={viewMode === 'card' ? "grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6" : "space-y-3 sm:space-y-4"}>
                    {categorizedDoctors.recommended.map((doctor) => (
                      viewMode === 'card' ? (
                        <DoctorCard key={doctor.id} doctor={doctor} badge="recommended" />
                      ) : (
                        <DoctorListItem key={doctor.id} doctor={doctor} badge="recommended" />
                      )
                    ))}
                  </div>
                </div>
              )}

              {/* Other Doctors Section */}
              {categorizedDoctors.others.length > 0 && (
                <div className="space-y-3 sm:space-y-4">
                  {(categorizedDoctors.myTeam.length > 0 || categorizedDoctors.recommended.length > 0) && (
                    <h3 className="text-sm sm:text-base lg:text-lg font-bold text-slate-900">
                      Other Doctors
                    </h3>
                  )}
                  <div className={viewMode === 'card' ? "grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6" : "space-y-3 sm:space-y-4"}>
                    {categorizedDoctors.others.map((doctor) => (
                      viewMode === 'card' ? (
                        <DoctorCard key={doctor.id} doctor={doctor} />
                      ) : (
                        <DoctorListItem key={doctor.id} doctor={doctor} />
                      )
                    ))}
                  </div>
                </div>
              )}

              {sortedDoctors.length === 0 && (
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

// Social Media Icons Component
function SocialMediaLinks({ socialMedia }: { socialMedia: any }) {
  if (!socialMedia) return null;

  const activePlatforms = [];
  
  if (socialMedia.facebook) {
    activePlatforms.push({
      url: socialMedia.facebook,
      label: 'Facebook',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      textColor: 'text-blue-600'
    });
  }

  if (socialMedia.twitter) {
    activePlatforms.push({
      url: socialMedia.twitter,
      label: 'Twitter',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      bgColor: 'bg-sky-50 hover:bg-sky-100',
      textColor: 'text-sky-600'
    });
  }

  if (socialMedia.linkedin) {
    activePlatforms.push({
      url: socialMedia.linkedin,
      label: 'LinkedIn',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      textColor: 'text-blue-700'
    });
  }

  if (socialMedia.instagram) {
    activePlatforms.push({
      url: socialMedia.instagram,
      label: 'Instagram',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/>
        </svg>
      ),
      bgColor: 'bg-pink-50 hover:bg-pink-100',
      textColor: 'text-pink-600'
    });
  }

  if (activePlatforms.length === 0) return null;

  return (
    <div className="flex items-center gap-1.5">
      {activePlatforms.map((platform, idx) => (
        <a
          key={idx}
          href={platform.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${platform.bgColor} ${platform.textColor}`}
          title={platform.label}
        >
          {platform.icon}
        </a>
      ))}
    </div>
  );
}

function DoctorCard({ doctor, badge }: { doctor: any; badge?: 'myTeam' | 'recommended' }) {
  const router = useRouter();
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  
  const { data: todaySlots, isLoading: loadingToday } = useDoctorAvailability(doctor.id, today);
  const { data: tomorrowSlots, isLoading: loadingTomorrow } = useDoctorAvailability(doctor.id, tomorrow);
  
  const nextVacation = getNextVacation(doctor as Doctor);
  const doctorOnVacation = isOnVacation(doctor as Doctor);
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(Date.now() + 86400000);
    
    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    const checkDate = new Date(dateStr);
    checkDate.setHours(0, 0, 0, 0);
    
    if (checkDate.getTime() === today.getTime()) return "Today";
    if (checkDate.getTime() === tomorrow.getTime()) return "Tomorrow";
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };
  
  const getEarliestSlots = () => {
    if (todaySlots?.availableSlots?.length) {
      return { date: today, slots: todaySlots.availableSlots.slice(0, 3) };
    } else if (tomorrowSlots?.availableSlots?.length) {
      return { date: tomorrow, slots: tomorrowSlots.availableSlots.slice(0, 3) };
    }
    return null;
  };
  
  const earliestAvailable = getEarliestSlots();
  const isLoadingSlots = loadingToday || loadingTomorrow;

  const handleTimeSlotClick = (date: string, time: string) => {
    const params = new URLSearchParams({
      doctorId: doctor.id,
      date: date,
      time: time,
    });
    router.push(`/appointments/new?${params.toString()}`);
  };

  return (
    <div className="group bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-lg border border-slate-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-300">
      <div className="flex items-start gap-3 sm:gap-4 lg:gap-5">
        <div className="relative flex-shrink-0">
          <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-500 via-blue-600 to-emerald-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
            <span className="text-white font-bold text-lg sm:text-xl lg:text-2xl">
              {doctor.firstName?.[0]}
              {doctor.lastName?.[0]}
            </span>
          </div>
          {doctor.isActive && (
            <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 bg-emerald-500 border-2 border-white rounded-full" title="Available"></div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2 sm:mb-3 gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer truncate" onClick={() => router.push(`/doctors/${doctor.id}`)}>
                  Dr. {doctor.firstName} {doctor.lastName}
                </h3>
                {badge === 'myTeam' && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] sm:text-xs font-bold rounded-full border border-blue-300 whitespace-nowrap">
                    YOUR DOCTOR
                  </span>
                )}
                {badge === 'recommended' && (
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] sm:text-xs font-bold rounded-full border border-emerald-300 whitespace-nowrap">
                    RECOMMENDED
                  </span>
                )}
              </div>
              <p className="text-blue-600 font-semibold text-sm sm:text-base truncate">{doctor.specialty}</p>
            </div>
            <div className="flex flex-col gap-1.5 sm:gap-2 flex-shrink-0">
              {doctor.acceptsVideo && (
                <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-emerald-50 border border-emerald-200 rounded-full">
                  <VideoCameraIcon className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600" />
                  <span className="text-[10px] sm:text-xs text-emerald-700 font-semibold">
                    Video
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
            <div className="flex items-center gap-0.5 sm:gap-1 min-w-0">
              {[...Array(5)].map((_, i) => (
                <StarIconSolid
                  key={i}
                  className={`h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 flex-shrink-0 ${
                    i < Math.floor(4.9) ? "text-yellow-400" : "text-slate-200"
                  }`}
                />
              ))}
              <span className="text-xs sm:text-sm font-bold text-slate-700 ml-1 sm:ml-2 whitespace-nowrap">
                4.9 <span className="hidden sm:inline font-normal text-slate-500">(89 reviews)</span>
              </span>
            </div>
            <div className="hidden sm:block">
              <SocialMediaLinks socialMedia={doctor.socialMedia} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-600 bg-slate-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">
              <ClockIcon className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 flex-shrink-0" />
              <span className="font-medium truncate text-[10px] sm:text-xs lg:text-sm">{doctor.workingHours || "9 AM - 5 PM"}</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-600 bg-slate-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">
              <MapPinIcon className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500 flex-shrink-0" />
              <span className="font-medium truncate text-[10px] sm:text-xs lg:text-sm">CarePoint</span>
            </div>
          </div>

          {/* Next Vacation Badge */}
          {nextVacation && (
            <div className="mb-3 sm:mb-4">
              <div className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border ${
                doctorOnVacation 
                  ? 'bg-orange-50 border-orange-300 text-orange-800' 
                  : 'bg-amber-50 border-amber-300 text-amber-800'
              }`}>
                <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] sm:text-xs font-semibold block">
                    {doctorOnVacation ? 'On Vacation' : 'Upcoming Vacation'}
                  </span>
                  <span className="text-[9px] sm:text-[10px] block truncate">
                    {formatVacationDates(nextVacation)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Availability Section */}
          <div className="mb-3 sm:mb-4 lg:mb-5">
            {isLoadingSlots ? (
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 py-2 sm:py-3">
                <ClockIcon className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                <span>Loading...</span>
              </div>
            ) : earliestAvailable ? (
              <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-emerald-100">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                  <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-emerald-800">
                    <span className="hidden sm:inline">Next Available: </span>{formatDate(earliestAvailable.date)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {earliestAvailable.slots.map((slot, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleTimeSlotClick(earliestAvailable.date, slot)}
                      className="px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 bg-white border-2 border-emerald-200 rounded-md sm:rounded-lg text-xs sm:text-sm font-semibold text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 hover:shadow-sm transition-all"
                    >
                      {formatTime(slot)}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-500 bg-slate-50 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2">
                <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate">Check calendar</span>
              </div>
            )}
          </div>

          <div className="flex gap-2 sm:gap-3">
            <Button
              size="sm"
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md text-xs sm:text-sm px-3 sm:px-4"
              onClick={() => router.push(`/appointments/new?doctorId=${doctor.id}`)}
            >
              <span className="hidden xs:inline">Book Appointment</span>
              <span className="xs:hidden">Book</span>
            </Button>
            <Button 
              variant="outline"
              size="sm"
              className="px-3 sm:px-4 lg:px-6 border-2 hover:bg-slate-50 text-xs sm:text-sm whitespace-nowrap"
              onClick={() => router.push(`/doctors/${doctor.id}`)}
            >
              <span className="hidden sm:inline">View Profile</span>
              <span className="sm:hidden">Profile</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DoctorListItem({ doctor, badge }: { doctor: any; badge?: 'myTeam' | 'recommended' }) {
  const router = useRouter();
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  
  const { data: todaySlots, isLoading: loadingToday } = useDoctorAvailability(doctor.id, today);
  const { data: tomorrowSlots, isLoading: loadingTomorrow } = useDoctorAvailability(doctor.id, tomorrow);
  
  const nextVacation = getNextVacation(doctor as Doctor);
  const doctorOnVacation = isOnVacation(doctor as Doctor);
  
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(Date.now() + 86400000);
    
    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    const checkDate = new Date(dateStr);
    checkDate.setHours(0, 0, 0, 0);
    
    if (checkDate.getTime() === today.getTime()) return "Today";
    if (checkDate.getTime() === tomorrow.getTime()) return "Tomorrow";
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getEarliestSlots = () => {
    if (todaySlots?.availableSlots?.length) {
      return { date: today, slots: todaySlots.availableSlots.slice(0, 2) };
    } else if (tomorrowSlots?.availableSlots?.length) {
      return { date: tomorrow, slots: tomorrowSlots.availableSlots.slice(0, 2) };
    }
    return null;
  };
  
  const earliestAvailable = getEarliestSlots();
  const isLoadingSlots = loadingToday || loadingTomorrow;

  const handleTimeSlotClick = (date: string, time: string) => {
    const params = new URLSearchParams({
      doctorId: doctor.id,
      date: date,
      time: time,
    });
    router.push(`/appointments/new?${params.toString()}`);
  };

  return (
    <div className="group bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5 shadow-md border border-slate-100 hover:shadow-lg hover:border-blue-200 transition-all duration-300">
      <div className="flex items-start sm:items-center gap-3 sm:gap-4 lg:gap-5">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-500 via-blue-600 to-emerald-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-base sm:text-lg lg:text-xl">
              {doctor.firstName?.[0]}
              {doctor.lastName?.[0]}
            </span>
          </div>
          {doctor.isActive && (
            <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-emerald-500 border-2 border-white rounded-full" title="Available"></div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1.5 sm:mb-2 gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 mb-0.5">
                <h3 className="text-sm sm:text-base lg:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer truncate" onClick={() => router.push(`/doctors/${doctor.id}`)}>
                  Dr. {doctor.firstName} {doctor.lastName}
                </h3>
                {badge === 'myTeam' && (
                  <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[9px] sm:text-[10px] font-bold rounded border border-blue-300 whitespace-nowrap">
                    YOUR DR
                  </span>
                )}
                {badge === 'recommended' && (
                  <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] sm:text-[10px] font-bold rounded border border-emerald-300 whitespace-nowrap">
                    RECOMMENDED
                  </span>
                )}
              </div>
              <p className="text-blue-600 font-medium text-xs sm:text-sm truncate">{doctor.specialty}</p>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {doctor.acceptsVideo && (
                <div className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-emerald-50 border border-emerald-200 rounded-full">
                  <VideoCameraIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-emerald-600" />
                  <span className="text-[10px] sm:text-xs text-emerald-700 font-medium">Video</span>
                </div>
              )}
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <StarIconSolid
                    key={i}
                    className={`h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 ${
                      i < Math.floor(4.9) ? "text-yellow-400" : "text-slate-200"
                    }`}
                  />
                ))}
                <span className="text-[10px] sm:text-xs font-semibold text-slate-700 ml-0.5 sm:ml-1">4.9</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-wrap text-[10px] sm:text-xs text-slate-600 mb-2 sm:mb-3">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <ClockIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 text-slate-400 flex-shrink-0" />
              <span className="truncate">{doctor.workingHours || "9 AM - 5 PM"}</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5">
              <MapPinIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 text-slate-400 flex-shrink-0" />
              <span>CarePoint</span>
            </div>
            {nextVacation && (
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md border text-[9px] sm:text-[10px] font-medium ${
                doctorOnVacation 
                  ? 'bg-orange-50 border-orange-300 text-orange-700' 
                  : 'bg-amber-50 border-amber-300 text-amber-700'
              }`}>
                <CalendarIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                <span className="whitespace-nowrap">
                  {doctorOnVacation ? 'On Vacation' : 'Vacation'}: {formatVacationDates(nextVacation)}
                </span>
              </div>
            )}
            <div className="hidden sm:block">
              <SocialMediaLinks socialMedia={doctor.socialMedia} />
            </div>
          </div>

          {/* Availability & Actions */}
          <div className="flex items-start sm:items-center justify-between gap-2 sm:gap-3 lg:gap-4 flex-wrap">
            <div className="flex-1 min-w-0 sm:min-w-[150px] lg:min-w-[200px]">
              {isLoadingSlots ? (
                <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-slate-500">
                  <ClockIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3 animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : earliestAvailable ? (
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <span className="text-[10px] sm:text-xs text-slate-600 font-medium whitespace-nowrap">{formatDate(earliestAvailable.date)}:</span>
                  <div className="flex gap-1 sm:gap-1.5">
                    {earliestAvailable.slots.map((slot, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleTimeSlotClick(earliestAvailable.date, slot)}
                        className="px-1.5 sm:px-2 lg:px-2.5 py-0.5 sm:py-1 bg-emerald-50 border border-emerald-200 rounded text-[10px] sm:text-xs font-medium text-emerald-700 hover:bg-emerald-100 transition-colors whitespace-nowrap"
                      >
                        {formatTime(slot)}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <span className="text-[10px] sm:text-xs text-slate-500">Check availability</span>
              )}
            </div>

            <div className="flex gap-1.5 sm:gap-2 flex-shrink-0">
              <Button
                size="sm"
                onClick={() => router.push(`/appointments/new?doctorId=${doctor.id}`)}
                className="text-[10px] sm:text-xs lg:text-sm px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2"
              >
                Book
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => router.push(`/doctors/${doctor.id}`)}
                className="text-[10px] sm:text-xs lg:text-sm px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2"
              >
                Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
