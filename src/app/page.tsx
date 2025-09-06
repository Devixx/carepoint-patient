"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, Star, Search, Filter, MapPin } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/primitives/Card";
import Button from "./ui/primitives/Button";
import Header from "./ui/layout/Header";
import Sidebar from "./ui/layout/Sidebar";
import { getDoctors } from "./api/doctors";
import { getPatientAppointments } from "./api/appointments";
import { useAuth } from "./contexts/AuthContext";
import clsx from "clsx";
import Link from "next/link";

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

export default function PatientDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
  const [searchQuery, setSearchQuery] = useState("");
  const { patient } = useAuth();

  // Fetch doctors
  const { data: doctors, isLoading: doctorsLoading } = useQuery({
    queryKey: ["doctors", selectedSpecialty],
    queryFn: () =>
      getDoctors(
        selectedSpecialty === "All Specialties" ? undefined : selectedSpecialty
      ),
  });

  // Fetch upcoming appointments
  const { data: appointmentsData, isLoading: appointmentsLoading } = useQuery({
    queryKey: ["patient-appointments"],
    queryFn: getPatientAppointments,
  });

  const upcomingAppointments = appointmentsData?.items?.slice(0, 3) || [];

  const filteredDoctors =
    doctors?.filter(
      (doctor) =>
        doctor.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  if (!patient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          title="Find Your Doctor"
          showSearch={false}
        />

        <main className="p-6 space-y-8">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white">
            <div className="max-w-4xl">
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {patient.firstName}! 👋
              </h1>
              <p className="text-blue-100 text-lg mb-6">
                Ready to book your next appointment? Browse our qualified
                healthcare professionals.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-blue-900">
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-8 w-8" />
                    <div>
                      <p className="text-sm text-blue-100">Next Appointment</p>
                      <p className="font-semibold text-white">
                        {upcomingAppointments[0]
                          ? new Date(
                              upcomingAppointments[0].startTime
                            ).toLocaleDateString()
                          : "No upcoming appointments"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-8 w-8" />
                    <div>
                      <p className="text-sm text-blue-100">
                        Total Appointments
                      </p>
                      <p className="font-semibold text-white">
                        {appointmentsData?.meta?.total || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <Star className="h-8 w-8" />
                    <div>
                      <p className="text-sm text-blue-100">Available Doctors</p>
                      <p className="font-semibold text-white">
                        {doctors?.length || 0}+
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Search and Filter */}
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search doctors by name or specialty..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <select
                          value={selectedSpecialty}
                          onChange={(e) => setSelectedSpecialty(e.target.value)}
                          className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-48"
                        >
                          {specialties.map((specialty) => (
                            <option key={specialty} value={specialty}>
                              {specialty}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>
                        {doctorsLoading
                          ? "Loading..."
                          : `${filteredDoctors.length} doctors available`}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Doctors Grid */}
              {doctorsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="h-8 bg-gray-200 rounded"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredDoctors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredDoctors.slice(0, 6).map((doctor) => (
                    <Card
                      key={doctor.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                            {doctor.photo ? (
                              <img
                                src={doctor.photo}
                                alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                                className="w-16 h-16 rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-lg font-medium text-blue-600">
                                {doctor.firstName[0]}
                                {doctor.lastName[0]}
                              </span>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900">
                              Dr. {doctor.firstName} {doctor.lastName}
                            </h3>
                            <p className="text-blue-600 font-medium">
                              {doctor.specialty}
                            </p>

                            {doctor.rating && (
                              <div className="flex items-center space-x-1 mt-1">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="text-sm text-gray-600">
                                  {doctor.rating} (25+ reviews)
                                </span>
                              </div>
                            )}

                            {doctor.experience && (
                              <p className="text-sm text-gray-600 mt-1">
                                {doctor.experience} experience
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex space-x-2">
                            <Link
                              href={`/book-appointment?doctor=${doctor.id}`}
                              className="flex-1"
                            >
                              <Button className="w-full">
                                Book Appointment
                              </Button>
                            </Link>
                            <Link href={`/doctors/${doctor.id}`}>
                              <Button variant="outline" size="md">
                                View Profile
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No doctors found
                    </h3>
                    <p className="text-gray-600">
                      Try adjusting your search or filter criteria.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar Content */}
            <div className="space-y-6">
              {/* Upcoming Appointments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span>Upcoming Appointments</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {appointmentsLoading ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      ))}
                    </div>
                  ) : upcomingAppointments.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingAppointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className="p-3 bg-blue-50 rounded-lg border border-blue-200"
                        >
                          <div className="font-medium text-gray-900">
                            Dr. {appointment.doctor.firstName}{" "}
                            {appointment.doctor.lastName}
                          </div>
                          <div className="text-sm text-gray-600">
                            {appointment.doctor.specialty}
                          </div>
                          <div className="text-sm text-blue-600 mt-1">
                            {new Date(
                              appointment.startTime
                            ).toLocaleDateString()}{" "}
                            at{" "}
                            {new Date(appointment.startTime).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </div>
                        </div>
                      ))}
                      <Link href="/appointments">
                        <Button variant="outline" size="sm" className="w-full">
                          View All Appointments
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 text-sm">
                        No upcoming appointments
                      </p>
                      <Button size="sm" className="mt-2">
                        Book Now
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/appointments">
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      View My Appointments
                    </Button>
                  </Link>

                  <Link href="/health-records">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      My Health Records
                    </Button>
                  </Link>

                  <Link href="/profile">
                    <Button variant="outline" className="w-full justify-start">
                      <User className="h-4 w-4 mr-2" />
                      Update Profile
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Health Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">Health Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-900 mb-2">
                      💡 Stay Healthy
                    </h4>
                    <p className="text-sm text-green-800">
                      Remember to schedule your annual checkup. Early detection
                      is key to maintaining good health.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
