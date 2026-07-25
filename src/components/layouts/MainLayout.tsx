import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar (Desktop) */}
      <Sidebar />

      {/* Main Content Container */}
      <div className="md:pl-64">
        <main className="mx-auto min-h-screen w-full max-w-2xl px-4 py-5 pb-20 sm:py-6 md:pb-8">
          {children}
        </main>
      </div>

      {/* Bottom Nav (Mobile) */}
      <BottomNav />
    </div>
  );
}
