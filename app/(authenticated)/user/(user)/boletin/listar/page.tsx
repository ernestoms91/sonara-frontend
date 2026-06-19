// app/user/boletines/listar/page.tsx
import { getBoletines } from "@/app/actions/boletin.actions";
import ListarBoletinesClient from "@/components/features/boletin/ListarBoletinesClient";

interface BoletinesPageProps {
  searchParams: Promise<{ page?: string; size?: string }>;
}

export default async function ListarBoletinesPage({
  searchParams,
}: BoletinesPageProps) {
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const pageSize = Number(params.size) || 10;

  const result = await getBoletines(currentPage, pageSize);

  if (!result.success || !result.data) {
    // Manejar el error - puedes redirigir o mostrar un mensaje
    throw new Error(result.error || "Error al cargar boletines");
  }

  console.log(result.data);
  return (
    <ListarBoletinesClient
      initialData={result.data}
      currentPage={currentPage}
    />
  );
}
