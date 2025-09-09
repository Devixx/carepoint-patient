"use client";

import { useState } from "react";
import {
  UserIcon,
  PencilIcon,
  ShieldCheckIcon,
  BellIcon,
  CreditCardIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CalendarIcon,
  HeartIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { Button } from "../components/ui/Button";
import BottomNavigation from "../components/navigation/BottomNavigation";
import DesktopSidebar from "../components/navigation/DesktopSidebar";
// import { useFakeAuth } from "../contexts/FakeAuthContext";
import { useAuth } from "../contexts/AuthContext";

export default function ProfilePage() {
  const { patient, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const profileData = {
    personalInfo: {
      firstName: patient?.firstName || "John",
      lastName: patient?.lastName || "Smith",
      email: patient?.email || "john.smith@example.com",
      phone: patient?.phone || "+352 621 000 000",
      dateOfBirth: "1985-03-15",
      address: "123 Main Street, Luxembourg City, Luxembourg",
      emergencyContact: "Jane Smith",
      emergencyPhone: "+352 621 111 111",
    },
    medicalInfo: {
      bloodType: "O+",
      allergies: "Penicillin, Shellfish",
      medications: "Lisinopril 10mg daily",
      insurance: "CNS Luxembourg - ID: 1234567890",
      preferredLanguage: "English",
    },
    preferences: {
      notifications: {
        email: true,
        sms: true,
        appointmentReminders: true,
        healthTips: false,
        marketing: false,
      },
    },
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <DesktopSidebar />

      <div className="lg:ml-64">
        <main className="pb-20 lg:pb-8">
          <div className="p-4 lg:p-8 space-y-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">My Profile</h1>
                  <p className="text-indigo-100 text-lg">
                    Manage your personal information and preferences
                  </p>
                </div>
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
                  <UserIcon className="h-10 w-10 text-white" />
                </div>
              </div>
            </div>

            {/* Profile Photo & Basic Info */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-2xl">
                    {profileData.personalInfo.firstName[0]}
                    {profileData.personalInfo.lastName[0]}
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">
                        {profileData.personalInfo.firstName}{" "}
                        {profileData.personalInfo.lastName}
                      </h2>
                      <p className="text-slate-600">
                        Patient since December 2020
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      leftIcon={<PencilIcon className="h-4 w-4" />}
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? "Save Changes" : "Edit Profile"}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <EnvelopeIcon className="h-4 w-4" />
                      <span>{profileData.personalInfo.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <PhoneIcon className="h-4 w-4" />
                      <span>{profileData.personalInfo.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <CalendarIcon className="h-4 w-4" />
                      <span>
                        Born{" "}
                        {new Date(
                          profileData.personalInfo.dateOfBirth
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPinIcon className="h-4 w-4" />
                      <span>Luxembourg City</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                  <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <UserIcon className="h-5 w-5 text-indigo-600" />
                    Personal Information
                  </h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={profileData.personalInfo.firstName}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={profileData.personalInfo.lastName}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profileData.personalInfo.email}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={profileData.personalInfo.phone}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Address
                      </label>
                      <textarea
                        value={profileData.personalInfo.address}
                        disabled={!isEditing}
                        rows={2}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-50"
                      />
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                  <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                    Emergency Contact
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Contact Name
                      </label>
                      <input
                        type="text"
                        value={profileData.personalInfo.emergencyContact}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profileData.personalInfo.emergencyPhone}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-slate-50"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Medical Information & Settings */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                  <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <HeartIcon className="h-5 w-5 text-red-500" />
                    Medical Information
                  </h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Blood Type
                        </label>
                        <input
                          type="text"
                          value={profileData.medicalInfo.bloodType}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-slate-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Language
                        </label>
                        <select
                          value={profileData.medicalInfo.preferredLanguage}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-slate-50"
                        >
                          <option>English</option>
                          <option>French</option>
                          <option>German</option>
                          <option>Luxembourgish</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Allergies
                      </label>
                      <textarea
                        value={profileData.medicalInfo.allergies}
                        disabled={!isEditing}
                        rows={2}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Current Medications
                      </label>
                      <textarea
                        value={profileData.medicalInfo.medications}
                        disabled={!isEditing}
                        rows={2}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-slate-50"
                      />
                    </div>
                  </div>
                </div>

                {/* Insurance & Billing */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                  <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <CreditCardIcon className="h-5 w-5 text-green-600" />
                    Insurance & Billing
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Insurance Provider
                      </label>
                      <input
                        type="text"
                        value={profileData.medicalInfo.insurance}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-slate-50"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-3">
                        <ShieldCheckIcon className="h-8 w-8 text-green-600" />
                        <div>
                          <p className="font-medium text-green-900">
                            Insurance Verified
                          </p>
                          <p className="text-sm text-green-700">
                            Coverage active through 2025
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notification Preferences */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                  <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <BellIcon className="h-5 w-5 text-blue-600" />
                    Notifications
                  </h3>

                  <div className="space-y-4">
                    {[
                      {
                        key: "appointmentReminders",
                        label: "Appointment Reminders",
                        description: "Get notified about upcoming appointments",
                      },
                      {
                        key: "healthTips",
                        label: "Health Tips",
                        description: "Receive wellness and health advice",
                      },
                      {
                        key: "email",
                        label: "Email Notifications",
                        description: "Receive updates via email",
                      },
                      {
                        key: "sms",
                        label: "SMS Notifications",
                        description: "Receive updates via text message",
                      },
                    ].map((pref) => (
                      <div
                        key={pref.key}
                        className="flex items-center justify-between p-3 border border-slate-200 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-slate-900">
                            {pref.label}
                          </p>
                          <p className="text-sm text-slate-600">
                            {pref.description}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={
                              profileData.preferences.notifications[
                                pref.key as keyof typeof profileData.preferences.notifications
                              ]
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-6">
                Account Actions
              </h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="outline">Download My Data</Button>
                <Button variant="outline">Privacy Settings</Button>
                <Button variant="outline">Change Password</Button>
                <Button
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={logout}
                >
                  Sign Out
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
