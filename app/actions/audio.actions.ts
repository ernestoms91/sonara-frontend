// app/actions/audio.actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { fetchWithAuth } from "@/lib/fetch-utils";
import { ActionResponse, AudioFromAPI } from "@/types/api";

// ============================================
// GET AUDIOS - Obtener lista de audios
// ============================================
export async function getAudios(
  page: number = 1,
  size: number = 30,
): Promise<
  ActionResponse<{
    items: AudioFromAPI[];
    total: number;
    page: number;
    size: number;
    pages: number;
  }>
> {
  return fetchWithAuth<{
    items: AudioFromAPI[];
    total: number;
    page: number;
    size: number;
    pages: number;
  }>(`/api/v1/audio/all?page=${page}&size=${size}`);
}

// ============================================
// CREATE AUDIO - Generar un nuevo audio individual
// ============================================
export async function createAudio(
  profileId: number,
  text: string,
): Promise<ActionResponse<AudioFromAPI>> {
  if (!profileId) {
    return { success: false, error: "Debes seleccionar un perfil de voz." };
  }

  if (!text?.trim()) {
    return { success: false, error: "El texto no puede estar vacío." };
  }

  const result = await fetchWithAuth<AudioFromAPI>(
    `/api/v1/audio/generate/${profileId}`,
    {
      method: "POST",
      body: JSON.stringify({ text }),
    },
  );

  if (result.success) {
    revalidatePath("/user/audios");
  }

  return result;
}

// ============================================
// CREATE DUET AUDIO - Generar un dueto con dos voces
// ============================================
export async function createDuetAudio(
  profileAId: number,
  profileBId: number,
  text: string,
): Promise<ActionResponse<AudioFromAPI>> {
  if (!profileAId || !profileBId) {
    return {
      success: false,
      error: "Debes seleccionar ambos perfiles de voz.",
    };
  }

  if (profileAId === profileBId) {
    return {
      success: false,
      error: "Los perfiles deben ser diferentes para un dueto.",
    };
  }

  if (!text?.trim()) {
    return { success: false, error: "El texto no puede estar vacío." };
  }

  const result = await fetchWithAuth<AudioFromAPI>(
    `/api/v1/audio/generate-duet/${profileAId}/${profileBId}`,
    { method: "POST", body: JSON.stringify({ text }) },
  );

  if (result.success) {
    revalidatePath("/user/audios");
  }

  return result;
}

// ============================================
// DELETE AUDIO - Eliminar un audio
// ============================================
export async function deleteAudio(audioId: number): Promise<ActionResponse> {
  const result = await fetchWithAuth(`/api/v1/audio/${audioId}`, {
    method: "DELETE",
  });

  if (result.success) {
    revalidatePath("/user/audios");
  }

  return result;
}

// ============================================
// BULK DELETE AUDIOS - Eliminar múltiples audios
// ============================================
export async function deleteAudios(
  audioIds: number[],
): Promise<ActionResponse> {
  if (!audioIds || audioIds.length === 0) {
    return {
      success: false,
      error: "No se seleccionaron audios para eliminar.",
    };
  }

  const result = await fetchWithAuth(`/api/v1/audio/bulk-delete`, {
    method: "POST",
    body: JSON.stringify({ audio_ids: audioIds }),
  });

  if (result.success) {
    revalidatePath("/user/audios");
  }

  return result;
}
