// app/user/boletines/crear/page.tsx
import { getAudios } from "@/app/actions/audio.actions";
import { SeleccionarAudiosBoletinClient } from "@/components/features/boletin/SeleccionarAudiosBoletinClient";

interface SeleccionarAudiosPageProps {
  searchParams: Promise<{ page?: string; size?: string }>;
}

export default async function SeleccionarAudiosPage({
  searchParams,
}: SeleccionarAudiosPageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const pageSize = Number(params.size) || 30;

  const result = await getAudios(currentPage, pageSize);

  if (!result.success || !result.data) {
    throw new Error(
      result.error || "Error al cargar los audios para el boletín",
    );
  }

  // CORRECCIÓN: Envolver en la estructura esperada
  const initialData = {
    ok: result.success,
    data: result.data, // { items, total, page, size, pages }
  };

  return (
    <SeleccionarAudiosBoletinClient
      initialData={initialData}
      currentPage={currentPage}
    />
  );
}
