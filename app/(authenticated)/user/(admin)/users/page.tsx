// app/admin/users/page.tsx
import { getUsers } from "@/app/actions/user.actions";
import UsersClient from "@/components/features/users/UsersClient";

interface UsersPageProps {
  searchParams: Promise<{
    page?: string;
    size?: string;
  }>;
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const params = await searchParams;

  const currentPage = Math.max(1, Number(params.page) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(params.size) || 10));

  const result = await getUsers(currentPage, pageSize);

  if (!result.success || !result.data) {
    throw new Error(result.error || "Error al cargar usuarios");
  }

  const key = `${currentPage}-${pageSize}-${result.data.total}`;

  return (
    <UsersClient key={key} initialData={result} currentPage={currentPage} />
  );
}
