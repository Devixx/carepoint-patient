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
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        Quick Actions
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action) => (
          <Link
            key={action.name}
            href={action.href}
            className="group p-4 rounded-lg border border-border hover:border-gray-300 hover:bg-surface-accent transition-all duration-200 focus-ring"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-brand-blue/10 rounded-lg flex items-center justify-center group-hover:bg-brand-blue/20 transition-colors">
                <action.icon className="w-5 h-5 text-brand-blue" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-medium text-text-primary group-hover:text-brand-blue">
                  {action.name}
                </h4>
                <p className="text-xs text-text-subtle mt-1">
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
