"use client";

import { useState } from "react";
import {
  DocumentTextIcon,
  BeakerIcon,
  HeartIcon,
  EyeIcon,
  ChevronRightIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { Button } from "../components/ui/Button";
import BottomNavigation from "../components/navigation/BottomNavigation";
import DesktopSidebar from "../components/navigation/DesktopSidebar";

const mockRecords = [
  {
    id: "1",
    type: "lab_result" as const,
    title: "Complete Blood Count (CBC)",
    date: "2025-01-03",
    provider: "Dr. Sarah Johnson",
    status: "normal" as const,
    summary: "All values within normal range",
    category: "Laboratory",
    urgent: false,
    hasAttachment: true,
  },
  {
    id: "2",
    type: "prescription" as const,
    title: "Lisinopril 10mg",
    date: "2025-01-01",
    provider: "Dr. Michael Chen",
    status: "active" as const,
    summary: "For blood pressure management - Take daily",
    category: "Medications",
    urgent: false,
    hasAttachment: false,
  },
  {
    id: "3",
    type: "visit_note" as const,
    title: "Annual Physical Examination",
    date: "2024-12-28",
    provider: "Dr. Emily Rodriguez",
    status: "completed" as const,
    summary: "Routine physical exam - All systems normal",
    category: "Visits",
    urgent: false,
    hasAttachment: true,
  },
  {
    id: "4",
    type: "imaging" as const,
    title: "Chest X-Ray",
    date: "2024-12-15",
    provider: "Radiology Department",
    status: "abnormal" as const,
    summary: "Minor inflammation noted - Follow-up recommended",
    category: "Imaging",
    urgent: true,
    hasAttachment: true,
  },
  {
    id: "5",
    type: "vaccine" as const,
    title: "COVID-19 Booster",
    date: "2024-12-01",
    provider: "CarePoint Pharmacy",
    status: "completed" as const,
    summary: "Pfizer-BioNTech booster vaccine administered",
    category: "Immunizations",
    urgent: false,
    hasAttachment: false,
  },
];

const recordIcons = {
  lab_result: BeakerIcon,
  prescription: HeartIcon,
  visit_note: DocumentTextIcon,
  imaging: EyeIcon,
  vaccine: HeartIcon,
};

const statusConfig = {
  normal: {
    label: "Normal",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  active: {
    label: "Active",
    className: "bg-blue-100 text-blue-700 border-blue-200",
  },
  completed: {
    label: "Completed",
    className: "bg-slate-100 text-slate-700 border-slate-200",
  },
  abnormal: {
    label: "Needs Attention",
    className: "bg-red-100 text-red-700 border-red-200",
  },
};

const categories = [
  "All",
  "Laboratory",
  "Medications",
  "Visits",
  "Imaging",
  "Immunizations",
];

export default function HealthRecordsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRecords = mockRecords.filter((record) => {
    const matchesCategory =
      selectedCategory === "All" || record.category === selectedCategory;
    const matchesSearch =
      record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.provider.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const urgentRecords = filteredRecords.filter((record) => record.urgent);

  return (
    <div className="min-h-screen bg-slate-50">
      <DesktopSidebar />

      <div className="lg:ml-64">
        <main className="pb-20 lg:pb-8">
          <div className="p-4 lg:p-8 space-y-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
              <h1 className="text-3xl font-bold mb-2">Health Records</h1>
              <p className="text-purple-100 text-lg">
                Your complete medical history at your fingertips
              </p>
            </div>

            {/* Urgent Items Alert */}
            {urgentRecords.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">!</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-red-900 mb-1">
                      Attention Required
                    </h3>
                    <p className="text-red-700 mb-3">
                      You have {urgentRecords.length} record(s) that need your
                      attention
                    </p>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Search & Filter */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
              <div className="space-y-4">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search your records..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                        selectedCategory === category
                          ? "bg-purple-600 text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Records List */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">
                  {filteredRecords.length} records found
                </h2>
                <Button
                  variant="outline"
                  leftIcon={<ArrowDownTrayIcon className="h-4 w-4" />}
                >
                  Export Records
                </Button>
              </div>

              <div className="space-y-4">
                {filteredRecords.map((record) => {
                  const Icon = recordIcons[record.type];
                  const status = statusConfig[record.status];

                  return (
                    <div
                      key={record.id}
                      className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow duration-200"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            record.urgent ? "bg-red-500" : "bg-purple-500"
                          }`}
                        >
                          <Icon className="h-6 w-6 text-white" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-bold text-slate-900">
                                {record.title}
                              </h3>
                              <p className="text-slate-600 text-sm">
                                {record.provider}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium border ${status.className}`}
                              >
                                {status.label}
                              </span>
                              {record.hasAttachment && (
                                <div className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center">
                                  <DocumentTextIcon className="h-4 w-4 text-slate-500" />
                                </div>
                              )}
                            </div>
                          </div>

                          <p className="text-slate-700 mb-3">
                            {record.summary}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="text-sm text-slate-500">
                              {new Date(record.date).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              rightIcon={
                                <ChevronRightIcon className="h-4 w-4" />
                              }
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-6 text-center border border-slate-100">
                <div className="text-2xl font-bold text-emerald-600">12</div>
                <div className="text-sm text-slate-600">Lab Results</div>
              </div>
              <div className="bg-white rounded-xl p-6 text-center border border-slate-100">
                <div className="text-2xl font-bold text-blue-600">3</div>
                <div className="text-sm text-slate-600">
                  Active Prescriptions
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 text-center border border-slate-100">
                <div className="text-2xl font-bold text-purple-600">8</div>
                <div className="text-sm text-slate-600">Visit Notes</div>
              </div>
              <div className="bg-white rounded-xl p-6 text-center border border-slate-100">
                <div className="text-2xl font-bold text-orange-600">5</div>
                <div className="text-sm text-slate-600">Immunizations</div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <BottomNavigation />
    </div>
  );
}
