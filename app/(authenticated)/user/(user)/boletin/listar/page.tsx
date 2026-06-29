// app/(authenticated)/user/boletin/listar/page.tsx
import { getBoletines } from "@/app/actions/boletin.actions";
import ListarBoletinesClient from "@/components/features/boletin/ListarBoletinesClient";

interface BoletinesPageProps {
  searchParams: Promise<{
    page?: string;
    size?: string;
  }>;
}

export default async function ListarBoletinesPage({
  searchParams,
}: BoletinesPageProps) {
  const params = await searchParams;

  const currentPage = Math.max(1, Number(params.page) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(params.size) || 10));

  const result = await getBoletines(currentPage, pageSize);

  if (!result.success || !result.data) {
    throw new Error(result.error || "Error al cargar boletines");
  }

  // ✅ Key que cambia cuando el total o la página cambian
  const key = `${currentPage}-${pageSize}-${result.data.total}`;

  return (
    <ListarBoletinesClient
      key={key}
      initialData={result}
      currentPage={currentPage}
    />
  );
}
