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
import {
  HomeIcon as HomeIconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid,
  CalendarIcon as CalendarIconSolid,
  DocumentTextIcon as DocumentTextIconSolid,
  UserIcon as UserIconSolid,
} from "@heroicons/react/24/solid";
import { useFakeAuth } from "../../contexts/FakeAuthContext";

const navigation = [
  { name: "Home", href: "/", icon: HomeIcon, activeIcon: HomeIconSolid },
  {
    name: "Find Care",
    href: "/find-care",
    icon: MagnifyingGlassIcon,
    activeIcon: MagnifyingGlassIconSolid,
  },
  {
    name: "Appointments",
    href: "/appointments",
    icon: CalendarIcon,
    activeIcon: CalendarIconSolid,
  },
  {
    name: "Health Records",
    href: "/records",
    icon: DocumentTextIcon,
    activeIcon: DocumentTextIconSolid,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: UserIcon,
    activeIcon: UserIconSolid,
  },
];

export default function DesktopSidebar() {
  const pathname = usePathname();
  const { patient, logout } = useFakeAuth();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-surface border-r border-border">
      <div className="flex flex-col flex-1 min-h-0">
        {/* Logo */}
        <div className="flex items-center h-16 px-6 border-b border-border">
          <HeartIcon className="h-8 w-8 text-brand-blue" />
          <span className="ml-2 text-xl font-bold text-gradient">
            CarePoint
          </span>
        </div>

        {/* Patient Info */}
        {patient && (
          <div className="px-6 py-4 border-b border-border">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-10 h-10 bg-brand-blue rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                  {patient.firstName[0]}
                  {patient.lastName[0]}
                </span>
              </div>
              <div className="ml-3 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {patient.firstName} {patient.lastName}
                </p>
                <p className="text-xs text-text-subtle truncate">
                  Patient Portal
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = isActive ? item.activeIcon : item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 focus-ring ${
                  isActive
                    ? "bg-brand-blue text-white"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-accent"
                }`}
              >
                <Icon className="flex-shrink-0 w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-border">
          <button
            onClick={logout}
            className="w-full text-left px-3 py-2 text-sm text-text-subtle hover:text-text-primary hover:bg-surface-accent rounded-lg transition-colors duration-200 focus-ring"
          >
            Sign Out
          </button>
          <p className="mt-2 px-3 text-xs text-text-muted">CarePoint v2.0</p>
        </div>
      </div>
    </aside>
  );
}
