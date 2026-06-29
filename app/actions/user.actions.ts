// app/actions/user.actions.ts
"use server";

import { fetchWithAuth } from "@/lib/fetch-utils";
import { ActionResponse } from "@/types/api";

// ============================================
// TIPOS
// ============================================
export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================
// GET CURRENT USER - Obtener usuario actual (CON autenticación)
// ============================================
export async function getCurrentUser(): Promise<ActionResponse<User>> {
  const result = await fetchWithAuth<User>("/api/v1/auth/me");

  if (!result.success || !result.data) {
    return {
      success: false,
      error: result.error || "Error al obtener usuario",
      data: undefined,
    };
  }

  return {
    success: true,
    data: result.data,
  };
}

// ============================================
// GET CURRENT USER SIMPLIFICADO - Retorna solo el usuario o null
// ============================================
export async function getCurrentUserSimple(): Promise<User | null> {
  const result = await getCurrentUser();

  if (!result.success || !result.data) {
    return null;
  }

  return result.data;
}

// ============================================
// UPDATE USER - Actualizar usuario
// ============================================
export async function updateUser(
  userId: number,
  data: Partial<Omit<User, "id" | "created_at" | "updated_at">>,
): Promise<ActionResponse<User>> {
  const result = await fetchWithAuth<User>(`/api/v1/user/${userId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

  return result;
}

// ============================================
// GET USER BY ID - Obtener usuario por ID (solo admin)
// ============================================
export async function getUserById(
  userId: number,
): Promise<ActionResponse<User>> {
  return fetchWithAuth<User>(`/api/v1/user/${userId}`);
}
