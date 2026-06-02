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
        Authorization: `Bearer ${token}`, // ← Enviar token
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
    revalidatePath("/user/audios");

    return { success: true };
  } catch (error) {
    console.error("Error en deleteAudio:", error);
    return {
      success: false,
      error: "Error de conexión con el servidor",
    };
  }
}

export async function createAudio(text: string) {
  try {
    // Obtener el token de la cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return {
        success: false,
        error: "No autorizado. Inicia sesión primero.",
      };
    }

    // Primero necesitas obtener un profile_id (perfil de voz)
    // Opción 1: Obtener el perfil por defecto del usuario
    const profileResponse = await fetch(`${BACKEND_URL}/api/v1/profile/my`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!profileResponse.ok) {
      return {
        success: false,
        error: "No se encontró un perfil de voz. Crea uno primero.",
      };
    }

    const profileData = await profileResponse.json();
    const profileId = profileData.data?.id || profileData.id;

    if (!profileId) {
      return {
        success: false,
        error: "No se encontró un perfil de voz.",
      };
    }

    // Generar el audio
    const formData = new FormData();
    formData.append("text", text);

    const response = await fetch(
      `${BACKEND_URL}/api/v1/audio/generate/${profileId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
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

    // Revalidar la ruta para mostrar el nuevo audio
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
