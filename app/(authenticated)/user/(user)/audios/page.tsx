import { AudiosClient } from "@/components/features/audios/AudiosClient";
import { getAudios } from "@/app/actions/audio.actions";

interface AudiosPageProps {
  searchParams: Promise<{ page?: string; size?: string }>;
}

export default async function AudiosPage({ searchParams }: AudiosPageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const pageSize = Number(params.size) || 10;

  const result = await getAudios(currentPage, pageSize);

  if (!result.success || !result.data) {
    throw new Error(result.error || "Error al cargar audios");
  }

  return <AudiosClient initialData={result.data} currentPage={currentPage} />;
}
