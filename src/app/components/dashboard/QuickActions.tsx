import {
  MagnifyingGlassIcon,
  CalendarIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

const actions = [
  {
    name: "Find a Doctor",
    href: "/find-care",
    icon: MagnifyingGlassIcon,
    description: "Search for specialists and book appointments",
  },
  {
    name: "Schedule Visit",
    href: "/appointments/new",
    icon: CalendarIcon,
    description: "Book your next appointment quickly",
  },
  {
    name: "View Records",
    href: "/records",
    icon: DocumentTextIcon,
    description: "Access your lab results and medical history",
  },
  {
    name: "Get Support",
    href: "/support",
    icon: ChatBubbleLeftRightIcon,
    description: "Contact our patient support team",
  },
];

export function QuickActions() {
  return (
    <div className="card p-4 sm:p-5 lg:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-text-primary mb-3 sm:mb-4">
        Quick Actions
      </h3>
      <div className="grid grid-cols-1 xs:grid-cols-2 gap-2.5 sm:gap-3 lg:gap-4">
        {actions.map((action) => (
          <Link
            key={action.name}
            href={action.href}
            className="group p-3 sm:p-4 rounded-lg border border-border hover:border-gray-300 hover:bg-surface-accent transition-all duration-200 focus-ring"
          >
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-brand-blue/10 rounded-lg flex items-center justify-center group-hover:bg-brand-blue/20 transition-colors">
                <action.icon className="w-4 h-4 sm:w-4.5 sm:h-4.5 lg:w-5 lg:h-5 text-brand-blue" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-medium text-text-primary group-hover:text-brand-blue truncate">
                  {action.name}
                </h4>
                <p className="text-[10px] sm:text-xs text-text-subtle mt-0.5 sm:mt-1 line-clamp-2">
                  {action.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
