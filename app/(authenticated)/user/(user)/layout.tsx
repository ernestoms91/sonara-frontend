// app/(authenticated)/user/(user)/layout.tsx
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/actions/user.actions";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const result = await getCurrentUser();

  if (!result.success || !result.data) {
    redirect("/login");
  }

  return <>{children}</>;
}
