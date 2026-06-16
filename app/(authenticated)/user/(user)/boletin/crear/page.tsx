// app/user/boletines/page.tsx
import { BoletinesClient } from "@/components/features/boletin/BoletinesClient";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL;

async function getBoletines(page: number = 1, size: number = 30) {
  // ← 30 por defecto
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    throw new Error("No autorizado");
  }

  const response = await fetch(
    `${BACKEND_URL}/api/v1/audio/all?page=${page}&size=${size}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();

  // Log para verificar
  console.log(
    `Cargados ${data.data?.items?.length || 0} boletines de ${data.data?.total || 0} totales`,
  );

  return data;
}

interface BoletinesPageProps {
  searchParams: Promise<{ page?: string; size?: string }>;
}

export default async function BoletinesPage({
  searchParams,
}: BoletinesPageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const pageSize = Number(params.size) || 30; // ← 30 elementos por página

  const initialData = await getBoletines(currentPage, pageSize);

  return (
    <BoletinesClient initialData={initialData} currentPage={currentPage} />
  );
}
