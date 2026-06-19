// app/actions/boletin.actions.ts
"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const BACKEND_URL = process.env.BACKEND_URL;

interface ApiResponseError {
  ok: boolean;
  message: string;
  data: null;
  timestamp: string;
}

// ============================================
// GET BOLETINES - Obtener lista de boletines
// ============================================
export async function getBoletines(
  page: number = 1,
  size: number = 30,
  activeOnly: boolean = true,
) {
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
      `${BACKEND_URL}/api/v1/boletin/all?page=${page}&size=${size}&active_only=${activeOnly}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch {
        const textError = await response.text();
        if (textError) {
          errorMessage = textError;
        }
      }

      return {
        success: false,
        error: errorMessage,
        data: null,
      };
    }

    const data = await response.json();

    return { success: true, error: null, data };
  } catch (error) {
    console.error("Error en getBoletines:", error);
    return {
      success: false,
      error: "Error de conexión con el servidor",
      data: null,
    };
  }
}
// ============================================
// CREATE COMPOUND BOLETIN - Crear boletín compuesto
// ============================================
export async function createCompoundBoletin(
  orderedIds: string[],
  startTime: string,
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return {
      success: false,
      error: "No autorizado. Inicia sesión nuevamente.",
    };
  }

  if (!orderedIds || orderedIds.length !== 30) {
    return {
      success: false,
      error: `Debes seleccionar exactamente 30 audios. Tienes ${orderedIds.length}`,
    };
  }

  if (!startTime) {
    return { success: false, error: "Debes seleccionar una fecha y hora" };
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/boletin/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        start_time: startTime,
        audio_ids: orderedIds,
      }),
    });

    // Intentar parsear la respuesta como JSON
    let errorMessage = `Error ${response.status}`;

    try {
      const data: ApiResponseError = await response.json();

      if (!response.ok || !data.ok) {
        // Usar el mensaje que viene del backend
        errorMessage = data.message || errorMessage;
      }
    } catch {
      // Si no se puede parsear como JSON, usar el texto plano
      const textError = await response.text();
      if (textError) {
        errorMessage = textError;
      }
    }

    if (!response.ok) {
      return { success: false, error: errorMessage };
    }

    revalidatePath("/user/boletin/crear");
    revalidatePath("/user/boletines");

    return { success: true, error: null };
  } catch (error) {
    console.error("Error en createCompoundBoletin:", error);
    return { success: false, error: "Error de conexión con el servidor" };
  }
}
