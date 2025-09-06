import BottomNavigation from "../components/navigation/BottomNavigation";
import DesktopSidebar from "../components/navigation/DesktopSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface-secondary">
      <DesktopSidebar />

      {/* Main content */}
      <div className="lg:ml-64">
        <main className="pb-20 lg:pb-8">{children}</main>
      </div>

      <BottomNavigation />
    </div>
  );
}
