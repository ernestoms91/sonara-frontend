import { cookies } from "next/headers";
import { AudiosClient } from "@/components/features/audios/AudiosClient";

const BACKEND_URL = process.env.BACKEND_URL;

async function getAudios(page: number = 1, size: number = 10) {
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

  return response.json();
}

interface AudiosPageProps {
  searchParams: Promise<{ page?: string; size?: string }>;
}

export default async function AudiosPage({ searchParams }: AudiosPageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const pageSize = Number(params.size) || 10;

  const initialData = await getAudios(currentPage, pageSize);

  return <AudiosClient initialData={initialData} currentPage={currentPage} />;
}
