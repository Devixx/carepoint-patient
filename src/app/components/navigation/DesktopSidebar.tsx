"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  DocumentTextIcon,
  UserIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../contexts/AuthContext"; // Changed from useFakeAuth

const navigation = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "Find Care", href: "/find-care", icon: MagnifyingGlassIcon },
  { name: "Appointments", href: "/appointments", icon: CalendarIcon },
  { name: "Health Records", href: "/records", icon: DocumentTextIcon },
  { name: "Profile", href: "/profile", icon: UserIcon },
];

export default function DesktopSidebar() {
  const pathname = usePathname();
  const { patient, logout } = useAuth(); // Changed from useFakeAuth

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-slate-200">
      <div className="flex flex-col flex-1">
        {/* Logo */}
        <div className="flex items-center h-16 px-6 border-b border-slate-200">
          <HeartIcon className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
            CarePoint
          </span>
        </div>

        {/* Patient Info */}
        {patient && (
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {patient.firstName[0]}
                  {patient.lastName[0]}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-900">
                  {patient.firstName} {patient.lastName}
                </p>
                <p className="text-xs text-slate-500">Patient Portal</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  isActive
                    ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600 ml-0 pl-2"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <item.icon className="flex-shrink-0 w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-slate-200">
          <button
            onClick={logout}
            className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors duration-200"
          >
            Sign Out
          </button>
          <p className="mt-2 px-3 text-xs text-slate-400">
            CarePoint Patient v1.0
          </p>
        </div>
      </div>
    </aside>
  );
}
