// app/actions/audio.actions.ts
"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const BACKEND_URL = process.env.BACKEND_URL;

export async function deleteAudio(audioId: number) {
  try {
    // 1. Obtener el token de la cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    // 2. Verificar que el token existe
    if (!token) {
      return {
        success: false,
        error: "No autorizado. Inicia sesión primero.",
      };
    }

    // 3. Llamar al backend con el token
    const response = await fetch(`${BACKEND_URL}/api/v1/audio/${audioId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // 4. Manejar errores del backend
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

    // 5. Revalidar la ruta para actualizar la UI
    revalidatePath("user/audios");

    return { success: true };
  } catch (error) {
    console.error("Error en deleteAudio:", error);
    return {
      success: false,
      error: "Error de conexión con el servidor",
    };
  }
}

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

export async function loadMoreAudios(page: number, size: number = 30) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return { error: "No autorizado", data: null };
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
      return { error: `Error ${response.status}`, data: null };
    }

    const data = await response.json();
    return { error: null, data };
  } catch (error) {
    return { error: "Error de conexión", data: null };
  }
}
