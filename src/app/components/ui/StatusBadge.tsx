interface StatusBadgeProps {
  status: "confirmed" | "pending" | "cancelled" | "completed" | "in_progress";
  size?: "sm" | "md";
}

const statusConfig = {
  confirmed: { label: "Confirmed", className: "status-confirmed" },
  pending: { label: "Pending", className: "status-pending" },
  cancelled: { label: "Cancelled", className: "status-cancelled" },
  completed: {
    label: "Completed",
    className: "bg-gray-100 text-gray-700 border-gray-200",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-blue-100 text-blue-700 border-blue-200",
  },
};

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const config = statusConfig[status];
  const sizeClasses =
    size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${config.className} ${sizeClasses}`}
    >
      {config.label}
    </span>
  );
}
