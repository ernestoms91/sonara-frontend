// app/actions/boletin.actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { fetchWithAuth } from "@/lib/fetch-utils";
import {
  ActionResponse,
  BoletinFromAPI,
  CreateBoletinRequest,
  UpdateBoletinRequest,
} from "@/types/api";

// ============================================
// GET BOLETINES - Obtener lista de boletines
// ============================================
export async function getBoletines(
  page: number = 1,
  size: number = 30,
  activeOnly: boolean = true,
): Promise<
  ActionResponse<{
    items: BoletinFromAPI[];
    total: number;
    page: number;
    size: number;
    pages: number;
  }>
> {
  return fetchWithAuth<{
    items: BoletinFromAPI[];
    total: number;
    page: number;
    size: number;
    pages: number;
  }>(`/api/v1/boletin/all?page=${page}&size=${size}&active_only=${activeOnly}`);
}

// ============================================
// GET BOLETIN BY ID - Obtener un boletín por ID
// ============================================
export async function getBoletinById(boletinId: number): Promise<
  ActionResponse<{
    id: number;
    start_time: string;
    created_by: string;
    created_at: string;
    updated_at: string;
    active: boolean;
    audio_count: number;
    audio_ids: string[];
    audios: string[];
  }>
> {
  return fetchWithAuth<{
    id: number;
    start_time: string;
    created_by: string;
    created_at: string;
    updated_at: string;
    active: boolean;
    audio_count: number;
    audio_ids: string[];
    audios: string[];
  }>(`/api/v1/boletin/${boletinId}`);
}

// ============================================
// CREATE BOLETIN - Crear un nuevo boletín
// ============================================
export async function createBoletin(
  orderedIds: string[],
  startTime: string,
): Promise<ActionResponse> {
  // Validaciones
  if (orderedIds.length !== 30) {
    return {
      success: false,
      error: `Debes seleccionar exactamente 30 audios. Tienes ${orderedIds.length}`,
    };
  }

  if (!startTime) {
    return {
      success: false,
      error: "Debes seleccionar una fecha y hora",
    };
  }

  const body: CreateBoletinRequest = {
    start_time: startTime,
    audio_ids: orderedIds,
  };

  const result = await fetchWithAuth("/api/v1/boletin/new", {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (result.success) {
    revalidatePath("/user/boletines");
  }

  return result;
}

// ============================================
// UPDATE BOLETIN - Actualizar un boletín existente
// ============================================
export async function updateBoletin(
  boletinId: number,
  audioIds: string[],
  startTime: string,
): Promise<ActionResponse> {
  // Validaciones
  if (audioIds.length !== 30) {
    return {
      success: false,
      error: `Debes tener exactamente 30 audios. Tienes ${audioIds.length}`,
    };
  }

  if (!startTime) {
    return {
      success: false,
      error: "start_time es obligatorio",
    };
  }

  const body: UpdateBoletinRequest = {
    audio_ids: audioIds,
    start_time: startTime,
  };

  const result = await fetchWithAuth(`/api/v1/boletin/${boletinId}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });

  if (result.success) {
    revalidatePath("/user/boletines");
    revalidatePath(`/user/boletines/${boletinId}`);
  }

  return result;
}

// ============================================
// DELETE BOLETIN - Eliminar un boletín
// ============================================
export async function deleteBoletin(
  boletinId: number,
): Promise<ActionResponse> {
  const result = await fetchWithAuth(`/api/v1/boletin/${boletinId}`, {
    method: "DELETE",
  });

  if (result.success) {
    revalidatePath("/user/boletines");
  }

  return result;
}

// ============================================
// CREATE COMPOUND BOLETIN - Crear boletín compuesto (alias de createBoletin)
// ============================================
export async function createCompoundBoletin(
  orderedIds: string[],
  startTime: string,
): Promise<ActionResponse> {
  return createBoletin(orderedIds, startTime);
}
