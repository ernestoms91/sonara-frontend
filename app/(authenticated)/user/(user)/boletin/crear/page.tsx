// app/user/boletines/page.tsx
import { getBoletines } from "@/app/actions/boletin.actions";
import { BoletinesClient } from "@/components/features/boletin/BoletinesClient";

interface BoletinesPageProps {
  searchParams: Promise<{ page?: string; size?: string }>;
}

export default async function BoletinesPage({
  searchParams,
}: BoletinesPageProps) {
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const pageSize = Number(params.size) || 30;

  const result = await getBoletines(currentPage, pageSize);

  if (!result.success || !result.data) {
    // Manejar el error - puedes redirigir o mostrar un mensaje
    throw new Error(result.error || "Error al cargar boletines");
  }

  return (
    <BoletinesClient initialData={result.data} currentPage={currentPage} />
  );
}
