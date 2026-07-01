// app/(authenticated)/user/(admin)/layout.tsx
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/actions/user.actions";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const result = await getCurrentUser();

  if (!result.success || !result.data) {
    redirect("/login");
  }

  // Verificar si es admin
  if (!result.data.is_admin) {
    redirect("/user/audios");
  }

  return <>{children}</>;
}
