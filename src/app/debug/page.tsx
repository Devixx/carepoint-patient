"use client";

import Link from "next/link";
import { Button } from "../components/ui/Button";

const testRoutes = [
  { name: "Home", path: "/", expected: "Working" },
  { name: "Find Care", path: "/find-care", expected: "Working" },
  { name: "Appointments", path: "/appointments", expected: "Working" },
  { name: "Records", path: "/records", expected: "Working" },
  { name: "Profile", path: "/profile", expected: "Working" },
  { name: "New Appointment", path: "/appointments/new", expected: "Missing" },
  { name: "Support", path: "/support", expected: "Missing" },
];

export default function DebugPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Route Testing Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testRoutes.map((route) => (
            <div key={route.path} className="bg-white p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{route.name}</h3>
                  <p className="text-sm text-slate-600">{route.path}</p>
                  <p
                    className={`text-xs ${
                      route.expected === "Working"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    Expected: {route.expected}
                  </p>
                </div>
                <Link href={route.path}>
                  <Button size="sm">Test</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
