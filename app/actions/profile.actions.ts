// app/actions/profile.actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { fetchWithAuth, fetchWithAuthFormData } from "@/lib/fetch-utils";
import { ActionResponse, Profile } from "@/types/api";

// ============================================
// GET PROFILES - Obtener lista de perfiles
// ============================================
export async function getProfiles(
  page: number = 1,
  size: number = 50,
  activeOnly: boolean = false,
): Promise<
  ActionResponse<{
    items: Profile[];
    total: number;
    page: number;
    size: number;
    pages: number;
  }>
> {
  return fetchWithAuth<{
    items: Profile[];
    total: number;
    page: number;
    size: number;
    pages: number;
  }>(`/api/v1/profile/?page=${page}&size=${size}&active_only=${activeOnly}`);
}

// ============================================
// GET PROFILE BY ID - Obtener un perfil por ID
// ============================================
export async function getProfileById(
  profileId: number,
): Promise<ActionResponse<Profile>> {
  return fetchWithAuth<Profile>(`/api/v1/profile/${profileId}`);
}

// ============================================
// GET ACTIVE PROFILES - Obtener solo perfiles activos
// ============================================
export async function getActiveProfiles(): Promise<
  ActionResponse<{
    items: Profile[];
    total: number;
    page: number;
    size: number;
    pages: number;
  }>
> {
  return getProfiles(1, 100, true);
}

// ============================================
// DELETE PROFILE - Eliminar un perfil
// ============================================
export async function deleteProfile(
  profileId: number,
  force: boolean = false,
): Promise<
  ActionResponse<{
    profile: {
      id: number;
      name: string;
      folder_id: string;
      active: boolean;
    };
    folder_deleted: boolean;
    folder_size_bytes: number;
  }>
> {
  const result = await fetchWithAuth<{
    profile: {
      id: number;
      name: string;
      folder_id: string;
      active: boolean;
    };
    folder_deleted: boolean;
    folder_size_bytes: number;
  }>(`/api/v1/profile/${profileId}?force=${force}`, {
    method: "DELETE",
  });

  if (result.success) {
    revalidatePath("/admin/profiles");
  }

  return result;
}

// ============================================
// DEACTIVATE PROFILE - Desactivar un perfil
// ============================================
export async function deactivateProfile(profileId: number): Promise<
  ActionResponse<{
    id: number;
    name: string;
    active: boolean;
  }>
> {
  const result = await fetchWithAuth<{
    id: number;
    name: string;
    active: boolean;
  }>(`/api/v1/profile/${profileId}/deactivate`, {
    method: "POST",
  });

  if (result.success) {
    revalidatePath("/admin/profiles");
  }

  return result;
}

// ============================================
// ACTIVATE PROFILE - Activar un perfil (verifica archivos)
// ============================================
export async function activateProfile(profileId: number): Promise<
  ActionResponse<{
    id: number;
    name: string;
    folder_id: string;
    active: boolean;
    hours_ready: boolean;
    minutes_ready: boolean;
    connectors_ready: boolean;
  }>
> {
  const result = await fetchWithAuth<{
    id: number;
    name: string;
    folder_id: string;
    active: boolean;
    hours_ready: boolean;
    minutes_ready: boolean;
    connectors_ready: boolean;
  }>(`/api/v1/profile/${profileId}/verify-and-activate`, {
    method: "POST",
  });

  if (result.success) {
    revalidatePath("/admin/profiles");
  }

  return result;
}

// ============================================
// CREATE PROFILE - Crear un nuevo perfil de voz
// ============================================
export async function createProfile(
  formData: FormData,
): Promise<ActionResponse<Profile>> {
  //  Usar fetchWithAuthFormData para multipart/form-data
  const result = await fetchWithAuthFormData<Profile>(
    "/api/v1/profile/new",
    formData,
    {
      method: "POST",
    },
  );

  if (result.success) {
    revalidatePath("/user/profiles");
  }

  return result;
}
