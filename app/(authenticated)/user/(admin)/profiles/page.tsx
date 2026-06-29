// app/admin/profiles/page.tsx
import { getProfiles } from "@/app/actions/profile.actions";
import ProfilesClient from "@/components/features/profiles/ProfilesClient";

interface ProfilesPageProps {
  searchParams: Promise<{
    page?: string;
    size?: string;
  }>;
}

export default async function ProfilesPage({
  searchParams,
}: ProfilesPageProps) {
  const params = await searchParams;

  const currentPage = Math.max(1, Number(params.page) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(params.size) || 10));

  const result = await getProfiles(currentPage, pageSize);

  if (!result.success || !result.data) {
    throw new Error(result.error || "Error al cargar perfiles");
  }
  const key = `${currentPage}-${pageSize}-${result.data.total}`;
  return (
    <ProfilesClient key={key} initialData={result} currentPage={currentPage} />
  );
}
