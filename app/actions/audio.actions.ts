// app/actions/audio.actions.ts
"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const BACKEND_URL = process.env.BACKEND_URL;

// ============================================
// GET AUDIOS - Obtener lista de audios (unificada)
// ============================================
export async function getAudios(page: number = 1, size: number = 30) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return {
      success: false,
      error: "No autorizado. Inicia sesión primero.",
      data: null,
    };
  }

  try {
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
      return {
        success: false,
        error: `Error ${response.status}: ${response.statusText}`,
        data: null,
      };
    }

    const data = await response.json();
    return { success: true, error: null, data };
  } catch (error) {
    console.error("Error en getAudios:", error);
    return {
      success: false,
      error: "Error de conexión con el servidor",
      data: null,
    };
  }
}

// ============================================
// CREATE AUDIO - Generar un nuevo audio
// ============================================
export async function createAudio(profileId: number, text: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return {
        success: false,
        error: "No autorizado. Inicia sesión primero.",
      };
    }

    if (!profileId) {
      return {
        success: false,
        error: "Debes seleccionar un perfil de voz.",
      };
    }

    if (!text.trim()) {
      return {
        success: false,
        error: "El texto no puede estar vacío.",
      };
    }

    const response = await fetch(
      `${BACKEND_URL}/api/v1/audio/generate/${profileId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || `Error ${response.status}`,
      };
    }

    const result = await response.json();

    revalidatePath("/user/audios");

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Error en createAudio:", error);
    return {
      success: false,
      error: "Error de conexión con el servidor",
    };
  }
}

// ============================================
// DELETE AUDIO - Eliminar un audio
// ============================================
export async function deleteAudio(audioId: number) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return {
        success: false,
        error: "No autorizado. Inicia sesión primero.",
      };
    }

    const response = await fetch(`${BACKEND_URL}/api/v1/audio/${audioId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        return {
          success: false,
          error: "Sesión expirada. Inicia sesión nuevamente.",
        };
      }
      if (response.status === 403) {
        return {
          success: false,
          error: "No tienes permiso para eliminar este audio.",
        };
      }
      if (response.status === 404) {
        return { success: false, error: "Audio no encontrado." };
      }
      return { success: false, error: `Error ${response.status}` };
    }

    revalidatePath("/user/audios");

    return { success: true, error: null };
  } catch (error) {
    console.error("Error en deleteAudio:", error);
    return {
      success: false,
      error: "Error de conexión con el servidor",
    };
  }
}
