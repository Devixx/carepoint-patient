"use client";

import { useEffect } from "react";
import { useFakeAuth } from "./contexts/FakeAuthContext";
import { WelcomeCard } from "./components/dashboard/WelcomeCard";
import { QuickActions } from "./components/dashboard/QuickActions";
import CareLoader from "./components/ui/CareLoader";
import BottomNavigation from "./components/navigation/BottomNavigation";
import DesktopSidebar from "./components/navigation/DesktopSidebar";

export default function DashboardHome() {
  const { patient, isLoading, loginAsDemo } = useFakeAuth();

  useEffect(() => {
    if (!isLoading && !patient) {
      loginAsDemo();
    }
  }, [isLoading, patient, loginAsDemo]);

  if (isLoading || !patient) {
    return <CareLoader variant="full" message="Loading your dashboard" />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <DesktopSidebar />

      <div className="lg:ml-64">
        <main className="pb-20 lg:pb-8">
          <div className="p-4 lg:p-8 space-y-8 animate-fade-in">
            <WelcomeCard />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <QuickActions />
              </div>

              {/* Health Summary */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-6">
                  Health Summary
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl">
                    <div>
                      <p className="text-2xl font-bold text-emerald-700">3</p>
                      <p className="text-sm text-emerald-600">
                        Active Prescriptions
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xl">💊</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                    <div>
                      <p className="text-2xl font-bold text-blue-700">2</p>
                      <p className="text-sm text-blue-600">
                        Upcoming Appointments
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xl">📅</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
                    <div>
                      <p className="text-2xl font-bold text-purple-700">1</p>
                      <p className="text-sm text-purple-600">New Lab Result</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xl">🔬</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <BottomNavigation />
    </div>
  );
}
