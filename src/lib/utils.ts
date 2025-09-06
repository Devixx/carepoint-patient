import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  date: Date | string,
  format: "short" | "long" | "time" = "short"
) {
  const d = new Date(date);

  switch (format) {
    case "short":
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    case "long":
      return d.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    case "time":
      return d.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    default:
      return d.toLocaleDateString();
  }
}

export function getTimeFromDate(date: Date | string) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function getRelativeTime(date: Date | string) {
  const now = new Date();
  const target = new Date(date);
  const diffInDays = Math.ceil(
    (target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Tomorrow";
  if (diffInDays === -1) return "Yesterday";
  if (diffInDays > 1 && diffInDays <= 7) return `In ${diffInDays} days`;
  if (diffInDays < -1 && diffInDays >= -7)
    return `${Math.abs(diffInDays)} days ago`;

  return formatDate(date, "short");
}
