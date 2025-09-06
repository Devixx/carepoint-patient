"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  DocumentTextIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid,
  CalendarIcon as CalendarIconSolid,
  DocumentTextIcon as DocumentTextIconSolid,
  UserIcon as UserIconSolid,
} from "@heroicons/react/24/solid";

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
    name: "Records",
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

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border lg:hidden">
      <div className="grid grid-cols-5 h-16">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = isActive ? item.activeIcon : item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`nav-item focus-ring ${
                isActive ? "nav-item-active" : "nav-item-inactive"
              }`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
