// app/actions/user.actions.ts
"use server";

import { fetchWithAuth } from "@/lib/fetch-utils";
import { ActionResponse, User } from "@/types/api";
import {
  validatePassword,
  validateUsername,
  validateEmail,
  validateFullName,
} from "@/lib/validations";

// ============================================
// GET CURRENT USER
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
// GET USERS - Lista paginada de usuarios (solo admin)
// ============================================
export async function getUsers(
  page: number = 1,
  size: number = 50,
): Promise<
  ActionResponse<{
    items: User[];
    total: number;
    page: number;
    size: number;
    pages: number;
  }>
> {
  return fetchWithAuth<{
    items: User[];
    total: number;
    page: number;
    size: number;
    pages: number;
  }>(`/api/v1/user/?page=${page}&size=${size}`);
}

// ============================================
// CREATE USER - Crear nuevo usuario (solo admin)
// ============================================
export async function createUser(data: {
  username: string;
  email: string;
  password: string;
  full_name: string;
  is_active?: boolean;
  is_admin?: boolean;
}): Promise<ActionResponse<User>> {
  const usernameValidation = validateUsername(data.username);
  if (!usernameValidation.isValid) {
    return {
      success: false,
      error: usernameValidation.error || "Usuario inválido",
    };
  }

  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid) {
    return {
      success: false,
      error: emailValidation.error || "Email inválido",
    };
  }

  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.isValid) {
    return {
      success: false,
      error: `Contraseña inválida: ${passwordValidation.errors.join(", ")}`,
    };
  }

  const fullNameValidation = validateFullName(data.full_name);
  if (!fullNameValidation.isValid) {
    return {
      success: false,
      error: fullNameValidation.error || "Nombre inválido",
    };
  }

  return fetchWithAuth<User>(`/api/v1/user/`, {
    method: "POST",
    body: JSON.stringify({
      username: data.username.trim(),
      email: data.email.trim(),
      password: data.password,
      full_name: data.full_name.trim(),
      is_active: data.is_active ?? true,
      is_admin: data.is_admin ?? false,
    }),
  });
}

// ============================================
// UPDATE USER - Actualizar usuario (solo admin)
// ============================================
export async function updateUser(
  userId: number,
  data: {
    username?: string;
    email?: string;
    password?: string;
    full_name?: string;
    is_active?: boolean;
    is_admin?: boolean;
  },
): Promise<ActionResponse<User>> {
  if (data.username !== undefined) {
    const usernameValidation = validateUsername(data.username);
    if (!usernameValidation.isValid) {
      return {
        success: false,
        error: usernameValidation.error || "Usuario inválido",
      };
    }
  }

  if (data.email !== undefined) {
    const emailValidation = validateEmail(data.email);
    if (!emailValidation.isValid) {
      return {
        success: false,
        error: emailValidation.error || "Email inválido",
      };
    }
  }

  if (data.password !== undefined && data.password !== "") {
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.isValid) {
      return {
        success: false,
        error: `Contraseña inválida: ${passwordValidation.errors.join(", ")}`,
      };
    }
  }

  if (data.full_name !== undefined) {
    const fullNameValidation = validateFullName(data.full_name);
    if (!fullNameValidation.isValid) {
      return {
        success: false,
        error: fullNameValidation.error || "Nombre inválido",
      };
    }
  }

  const cleanData: Record<string, unknown> = {};
  if (data.username !== undefined) cleanData.username = data.username.trim();
  if (data.email !== undefined) cleanData.email = data.email.trim();
  if (data.password !== undefined && data.password !== "") {
    cleanData.password = data.password;
  }
  if (data.full_name !== undefined) cleanData.full_name = data.full_name.trim();
  if (data.is_active !== undefined) cleanData.is_active = data.is_active;
  if (data.is_admin !== undefined) cleanData.is_admin = data.is_admin;

  return fetchWithAuth<User>(`/api/v1/user/${userId}`, {
    method: "PUT",
    body: JSON.stringify(cleanData),
  });
}

// ============================================
// DELETE USER - Deshabilitar usuario (soft delete) (solo admin)
// ============================================
export async function deleteUser(
  userId: number,
): Promise<ActionResponse<{ message: string }>> {
  return fetchWithAuth<{ message: string }>(`/api/v1/user/${userId}`, {
    method: "DELETE",
  });
}

// ============================================
// ENABLE USER - Habilitar usuario (solo admin)
// ============================================
export async function enableUser(
  userId: number,
): Promise<ActionResponse<User>> {
  return fetchWithAuth<User>(`/api/v1/user/${userId}/enable`, {
    method: "PUT",
  });
}

// ============================================
// TOGGLE USER ACTIVE - Activar/Desactivar usuario (solo admin)
// ============================================
export async function toggleUserActive(
  userId: number,
  active: boolean,
): Promise<ActionResponse<User>> {
  if (active) {
    return enableUser(userId);
  } else {
    const result = await deleteUser(userId);
    return {
      success: result.success,
      error: result.error,
      data: result.success ? undefined : undefined,
    };
  }
}
