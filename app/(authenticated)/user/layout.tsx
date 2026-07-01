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

      <div className="flex flex-1 flex-col">
        <MobileNavbar />
        <main className="flex-1 p-4 pt-6 md:pt-6">{children}</main>
      </div>
    </SidebarProvider>
  );
}
