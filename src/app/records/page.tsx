"use client";

import { useState } from "react";
import {
  DocumentTextIcon,
  BeakerIcon,
  HeartIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
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
    summary: "All values within normal range. Hemoglobin, WBC, and platelets within reference ranges.",
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
    summary: "For blood pressure management. Take once daily in the morning.",
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
    summary: "Routine physical exam completed. All systems normal. BMI 23.4.",
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
    summary: "Minor inflammation noted in lower left lobe. Follow-up recommended in 4–6 weeks.",
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
    summary: "Pfizer-BioNTech booster vaccine administered. No adverse reactions observed.",
    category: "Immunizations",
    urgent: false,
    hasAttachment: false,
  },
];

const RECORD_ICONS = {
  lab_result: BeakerIcon,
  prescription: HeartIcon,
  visit_note: DocumentTextIcon,
  imaging: EyeIcon,
  vaccine: HeartIcon,
};

const ICON_COLORS: Record<string, string> = {
  lab_result: "bg-purple-500",
  prescription: "bg-blue-500",
  visit_note: "bg-emerald-500",
  imaging: "bg-orange-500",
  vaccine: "bg-teal-500",
};

const STATUS_CONFIG = {
  normal: { label: "Normal", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  active: { label: "Active", className: "bg-blue-100 text-blue-700 border-blue-200" },
  completed: { label: "Completed", className: "bg-slate-100 text-slate-700 border-slate-200" },
  abnormal: { label: "Needs Attention", className: "bg-red-100 text-red-700 border-red-200" },
};

const CATEGORIES = ["All", "Laboratory", "Medications", "Visits", "Imaging", "Immunizations"];

function groupByMonth(records: typeof mockRecords) {
  const groups: Record<string, typeof mockRecords> = {};
  records.forEach((r) => {
    const d = new Date(r.date + "T12:00:00");
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(r);
  });
  return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
}

function formatMonthKey(key: string) {
  const [year, month] = key.split("-");
  return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export default function HealthRecordsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = mockRecords
    .filter((r) => {
      const matchesCat = selectedCategory === "All" || r.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch = r.title.toLowerCase().includes(q) || r.provider.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  const urgentRecords = filtered.filter((r) => r.urgent);
  const groups = groupByMonth(filtered);

  return (
    <div className="min-h-screen bg-slate-50">
      <DesktopSidebar />
      <div className="lg:ml-64">
        <main className="pb-20 lg:pb-8">
          <div className="p-4 lg:p-8 space-y-6">

            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
              <h1 className="text-3xl font-bold mb-1">Health Records</h1>
              <p className="text-purple-100">Your complete medical history timeline</p>
            </div>

            {/* Urgent Alert */}
            {urgentRecords.length > 0 && (
              <div className="flex items-start gap-4 bg-red-50 border border-red-200 rounded-2xl p-5">
                <div className="flex-shrink-0 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                  <ExclamationTriangleIcon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-red-900">Attention Required</p>
                  <p className="text-red-700 text-sm mt-0.5">
                    {urgentRecords.length} record{urgentRecords.length > 1 ? "s" : ""} need your attention
                  </p>
                  <button
                    onClick={() => setExpandedId(urgentRecords[0].id)}
                    className="mt-3 px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            )}

            {/* Search & Filter */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      selectedCategory === cat
                        ? "bg-purple-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Timeline */}
            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-100">
                <DocumentTextIcon className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No records found</p>
              </div>
            ) : (
              <div className="space-y-8">
                {groups.map(([monthKey, records]) => (
                  <div key={monthKey}>
                    {/* Month label */}
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-sm font-bold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                        {formatMonthKey(monthKey)}
                      </span>
                      <div className="flex-1 h-px bg-slate-200" />
                      <span className="text-xs text-slate-400">{records.length} record{records.length > 1 ? "s" : ""}</span>
                    </div>

                    {/* Records in month */}
                    <div className="relative pl-8">
                      {/* Vertical line */}
                      <div className="absolute left-3.5 top-0 bottom-0 w-px bg-slate-200" />

                      <div className="space-y-4">
                        {records.map((record, idx) => {
                          const Icon = RECORD_ICONS[record.type];
                          const iconColor = ICON_COLORS[record.type] || "bg-slate-400";
                          const status = STATUS_CONFIG[record.status];
                          const isExpanded = expandedId === record.id;
                          const isLast = idx === records.length - 1;

                          return (
                            <div key={record.id} className="relative">
                              {/* Node dot */}
                              <div
                                className={`absolute -left-8 top-4 w-7 h-7 rounded-full flex items-center justify-center ring-2 ring-white ${
                                  record.urgent ? "bg-red-500" : iconColor
                                }`}
                              >
                                <Icon className="h-3.5 w-3.5 text-white" />
                              </div>

                              {/* Card */}
                              <div
                                className={`bg-white rounded-xl border transition-all duration-200 ${
                                  isExpanded
                                    ? "border-purple-200 shadow-md"
                                    : "border-slate-100 shadow-sm hover:shadow-md"
                                } ${record.urgent ? "border-l-4 border-l-red-400" : ""}`}
                              >
                                <button
                                  type="button"
                                  className="w-full text-left p-4"
                                  onClick={() => setExpandedId(isExpanded ? null : record.id)}
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <p className="font-semibold text-slate-900 text-sm">{record.title}</p>
                                        {record.urgent && (
                                          <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded">URGENT</span>
                                        )}
                                      </div>
                                      <p className="text-xs text-slate-500 mt-0.5">{record.provider}</p>
                                      <p className="text-xs text-slate-400 mt-0.5">
                                        {new Date(record.date + "T12:00:00").toLocaleDateString("en-US", {
                                          weekday: "short", month: "short", day: "numeric",
                                        })}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${status.className}`}>
                                        {status.label}
                                      </span>
                                      <ChevronDownIcon
                                        className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                                      />
                                    </div>
                                  </div>
                                </button>

                                {/* Expanded detail */}
                                {isExpanded && (
                                  <div className="px-4 pb-4 border-t border-slate-100 pt-3 space-y-3">
                                    <p className="text-sm text-slate-700">{record.summary}</p>
                                    <div className="grid grid-cols-2 gap-3 text-xs">
                                      <div>
                                        <span className="text-slate-400">Category</span>
                                        <p className="font-medium text-slate-800 mt-0.5">{record.category}</p>
                                      </div>
                                      <div>
                                        <span className="text-slate-400">Attachment</span>
                                        <p className="font-medium text-slate-800 mt-0.5">
                                          {record.hasAttachment ? "Available" : "None"}
                                        </p>
                                      </div>
                                    </div>
                                    {record.hasAttachment && (
                                      <button className="flex items-center gap-1.5 text-xs text-purple-600 hover:text-purple-700 font-medium">
                                        <DocumentTextIcon className="h-4 w-4" />
                                        Download attachment
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Lab Results", value: "12", color: "text-purple-600" },
                { label: "Prescriptions", value: "3", color: "text-blue-600" },
                { label: "Visit Notes", value: "8", color: "text-emerald-600" },
                { label: "Immunizations", value: "5", color: "text-teal-600" },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-white rounded-xl p-4 text-center border border-slate-100 shadow-sm">
                  <div className={`text-2xl font-bold ${color}`}>{value}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{label}</div>
                </div>
              ))}
            </div>

          </div>
        </main>
      </div>
      <BottomNavigation />
    </div>
  );
}
