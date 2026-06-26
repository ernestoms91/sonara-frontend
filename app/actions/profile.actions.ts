// app/actions/profile.actions.ts
"use server";

import { fetchWithAuth } from "@/lib/fetch-utils";
import { ActionResponse } from "@/types/api";

// ============================================
// TIPOS
// ============================================
export interface Profile {
  id: number;
  name: string;
  description?: string;
  language?: string;
  gender?: string;
  age?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================
// GET PROFILES - Obtener lista de perfiles de voz
// ============================================
export async function getProfiles(
  page: number = 1,
  size: number = 50,
  activeOnly: boolean = true,
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
