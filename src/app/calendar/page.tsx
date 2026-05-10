"use client";

import { useState, useMemo } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import BottomNavigation from "../components/navigation/BottomNavigation";
import DesktopSidebar from "../components/navigation/DesktopSidebar";
import { usePatientAppointments } from "@/hooks/api";
import CareLoader from "../components/ui/CareLoader";

const STATUS_STYLES: Record<string, string> = {
  confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  completed: "bg-slate-100 text-slate-700 border-slate-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
  in_progress: "bg-blue-100 text-blue-700 border-blue-200",
  no_show: "bg-red-100 text-red-600 border-red-200",
};

const STATUS_DOT: Record<string, string> = {
  confirmed: "bg-emerald-500",
  pending: "bg-amber-500",
  completed: "bg-slate-400",
  cancelled: "bg-red-400",
  in_progress: "bg-blue-500",
  no_show: "bg-red-400",
};

function toLocalDateKey(isoString: string) {
  const d = new Date(isoString);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function buildMonthGrid(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function CalendarPage() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const { data, isLoading } = usePatientAppointments({ limit: 200 });
  const appointments = data?.items || [];

  // Group appointments by local date key
  const byDay = useMemo(() => {
    const map: Record<string, typeof appointments> = {};
    appointments.forEach((apt) => {
      const key = toLocalDateKey(apt.startTime);
      if (!map[key]) map[key] = [];
      map[key].push(apt);
    });
    return map;
  }, [appointments]);

  const grid = buildMonthGrid(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  const selectedAppointments = selectedKey ? (byDay[selectedKey] || []) : [];

  return (
    <div className="min-h-screen bg-slate-50">
      <DesktopSidebar />
      <div className="lg:ml-64">
        <main className="pb-20 lg:pb-8">
          <div className="p-4 lg:p-8 space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl p-6 text-white">
              <h1 className="text-3xl font-bold mb-1">Calendar</h1>
              <p className="text-blue-100">Your appointments at a glance</p>
            </div>

            {isLoading ? (
              <CareLoader variant="full" message="Loading your calendar..." />
            ) : (
              <>
                {/* Month Navigator */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <button
                      onClick={prevMonth}
                      className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                      <ChevronLeftIcon className="h-5 w-5 text-slate-600" />
                    </button>
                    <h2 className="text-lg font-bold text-slate-900">
                      {MONTH_NAMES[viewMonth]} {viewYear}
                    </h2>
                    <button
                      onClick={nextMonth}
                      className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                      <ChevronRightIcon className="h-5 w-5 text-slate-600" />
                    </button>
                  </div>

                  {/* Day headers */}
                  <div className="grid grid-cols-7 border-b border-slate-100">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                      <div key={d} className="py-2 text-center text-xs font-semibold text-slate-400 uppercase tracking-wide">
                        {d}
                      </div>
                    ))}
                  </div>

                  {/* Grid */}
                  <div className="grid grid-cols-7">
                    {grid.map((day, idx) => {
                      if (!day) {
                        return <div key={`empty-${idx}`} className="h-14 sm:h-16 border-b border-r border-slate-50" />;
                      }
                      const key = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                      const dayApts = byDay[key] || [];
                      const isToday =
                        day === today.getDate() &&
                        viewMonth === today.getMonth() &&
                        viewYear === today.getFullYear();
                      const isSelected = key === selectedKey;

                      return (
                        <button
                          key={key}
                          onClick={() => setSelectedKey(isSelected ? null : key)}
                          className={`h-14 sm:h-16 border-b border-r border-slate-50 flex flex-col items-center justify-start pt-1.5 gap-1 transition-colors ${
                            isSelected
                              ? "bg-blue-50"
                              : "hover:bg-slate-50"
                          }`}
                        >
                          <span
                            className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium ${
                              isToday
                                ? "bg-blue-600 text-white"
                                : isSelected
                                ? "text-blue-700 font-bold"
                                : "text-slate-700"
                            }`}
                          >
                            {day}
                          </span>
                          {dayApts.length > 0 && (
                            <div className="flex gap-0.5 flex-wrap justify-center px-1">
                              {dayApts.slice(0, 3).map((apt) => (
                                <span
                                  key={apt.id}
                                  className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[apt.status || "pending"] || "bg-blue-400"}`}
                                />
                              ))}
                              {dayApts.length > 3 && (
                                <span className="text-[9px] text-slate-400 leading-none">+{dayApts.length - 3}</span>
                              )}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-4 px-1 text-xs text-slate-500">
                  {[
                    { label: "Confirmed", dot: "bg-emerald-500" },
                    { label: "Pending", dot: "bg-amber-500" },
                    { label: "Completed", dot: "bg-slate-400" },
                    { label: "Cancelled", dot: "bg-red-400" },
                  ].map(({ label, dot }) => (
                    <div key={label} className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${dot}`} />
                      {label}
                    </div>
                  ))}
                </div>

                {/* Selected Day Panel */}
                {selectedKey && (
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                      <CalendarDaysIcon className="h-5 w-5 text-blue-600" />
                      <h3 className="font-bold text-slate-900">
                        {new Date(selectedKey + "T12:00:00").toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </h3>
                      <span className="ml-auto text-sm text-slate-500">
                        {selectedAppointments.length} appointment{selectedAppointments.length !== 1 ? "s" : ""}
                      </span>
                    </div>

                    {selectedAppointments.length === 0 ? (
                      <div className="px-6 py-10 text-center text-slate-400 text-sm">
                        No appointments on this day
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-50">
                        {selectedAppointments
                          .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                          .map((apt) => {
                            const start = new Date(apt.startTime);
                            const end = new Date(apt.endTime);
                            const statusStyle = STATUS_STYLES[apt.status || "pending"] || "bg-slate-100 text-slate-700 border-slate-200";
                            return (
                              <div key={apt.id} className="px-6 py-4 flex items-start gap-4">
                                <div className="flex-shrink-0 text-center w-14">
                                  <p className="text-sm font-bold text-slate-900">
                                    {start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
                                  </p>
                                  <p className="text-[11px] text-slate-400">
                                    {end.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
                                  </p>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-slate-900 truncate">{apt.title}</p>
                                  {apt.doctor && (
                                    <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                                      <UserIcon className="h-3.5 w-3.5" />
                                      Dr. {apt.doctor.firstName} {apt.doctor.lastName}
                                    </p>
                                  )}
                                  {apt.description && (
                                    <p className="text-xs text-slate-400 mt-1 truncate">{apt.description}</p>
                                  )}
                                </div>
                                <span className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyle}`}>
                                  {(apt.status || "pending").replace("_", " ")}
                                </span>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
      <BottomNavigation />
    </div>
  );
}
