// app/(authenticated)/user/layout.tsx
import { AppSidebar } from "@/components/common/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { MobileNavbar } from "@/components/common/MobileNavbar";
import { getCurrentUser } from "@/app/actions/user.actions";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Cargar el usuario en el servidor
  const result = await getCurrentUser();

  // Verificar autenticación
  if (!result.success || !result.data) {
    redirect("/login");
  }

  const user = result.data;

  return (
    <SidebarProvider>
      <AppSidebar user={user} />

      <div className="relative flex min-h-svh flex-1 flex-col overflow-x-clip bg-background bg-ambient">
        <MobileNavbar />
        <main className="flex min-h-0 flex-1 flex-col">{children}</main>
      </div>
    </SidebarProvider>
  );
}
