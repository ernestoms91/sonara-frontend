import { AppSidebar } from "@/components/common/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { MobileNavbar } from "@/components/common/MobileNavbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />

      {/* Contenido principal */}
      <div className="flex flex-1 flex-col">
        {/* Navbar solo en móvil */}
        <MobileNavbar />

        {/* Contenido con padding superior en móvil para que no lo tape el navbar */}
        <main className="flex-1 p-4 pt-6 md:pt-6">{children}</main>
      </div>
    </SidebarProvider>
  );
}
