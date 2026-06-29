// lib/fetch-utils.ts
"use server";

import { cookies } from "next/headers";
import { ActionResponse } from "@/types/api";

const BACKEND_URL = process.env.BACKEND_URL;

export async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return null;
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export async function getErrorMessage(response: Response) {
  try {
    const data = await response.json();
    return data.message || data.error || `Error ${response.status}`;
  } catch {
    try {
      return await response.text();
    } catch {
      return `Error ${response.status}`;
    }
  }
}

export async function fetchWithoutAuth<T>(
  url: string,
  options?: RequestInit,
): Promise<ActionResponse<T>> {
  try {
    const fullUrl = url.startsWith("http") ? url : `${BACKEND_URL}${url}`;

    const response = await fetch(fullUrl, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    });

    if (!response.ok) {
      const errorMessage = await getErrorMessage(response);
      return {
        success: false,
        error: errorMessage,
        data: undefined,
      };
    }

    const responseData = await response.json();

    // Si la respuesta tiene la estructura { ok, message, data }
    if (responseData.ok !== undefined && responseData.data !== undefined) {
      return {
        success: responseData.ok,
        error: responseData.ok ? undefined : responseData.message,
        data: responseData.data,
      };
    }

    // Si la respuesta es directa (sin wrapper)
    return {
      success: true,
      error: undefined,
      data: responseData,
    };
  } catch (error) {
    console.error("Error en fetchWithoutAuth:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error de conexión",
      data: undefined,
    };
  }
}

export async function fetchWithAuth<T>(
  url: string,
  options?: RequestInit,
): Promise<ActionResponse<T>> {
  try {
    const headers = await getAuthHeaders();

    if (!headers) {
      return {
        success: false,
        error: "UNAUTHORIZED",
        data: undefined,
      };
    }

    const fullUrl = url.startsWith("http") ? url : `${BACKEND_URL}${url}`;

    // Si el body es FormData, no establecer Content-Type
    const isFormData = options?.body instanceof FormData;
    const requestHeaders = isFormData
      ? { Authorization: headers.Authorization } // Solo el token, sin Content-Type
      : { ...headers, "Content-Type": "application/json" };

    const response = await fetch(fullUrl, {
      ...options,
      headers: {
        ...requestHeaders,
        ...(options?.headers || {}),
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorMessage = await getErrorMessage(response);

      if (response.status === 401) {
        const cookieStore = await cookies();
        cookieStore.delete("access_token");
      }

      return {
        success: false,
        error: errorMessage,
        data: undefined,
      };
    }

    const responseData = await response.json();

    // Si la respuesta tiene la estructura { ok, message, data }
    if (responseData.ok !== undefined && responseData.data !== undefined) {
      return {
        success: responseData.ok,
        error: responseData.ok ? undefined : responseData.message,
        data: responseData.data,
      };
    }

    // Si la respuesta es directa (sin wrapper)
    return {
      success: true,
      error: undefined,
      data: responseData,
    };
  } catch (error) {
    console.error("Error en fetchWithAuth:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error de conexión",
      data: undefined,
    };
  }
}

// ============================================
// FETCH WITH AUTH FORM DATA - Para subida de archivos
// ============================================
export async function fetchWithAuthFormData<T>(
  url: string,
  formData: FormData,
  options?: RequestInit,
): Promise<ActionResponse<T>> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return {
        success: false,
        error: "UNAUTHORIZED",
        data: undefined,
      };
    }

    const fullUrl = url.startsWith("http") ? url : `${BACKEND_URL}${url}`;

    const response = await fetch(fullUrl, {
      ...options,
      method: options?.method || "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // NO agregar Content-Type, fetch lo establece automáticamente con boundary
        ...(options?.headers || {}),
      },
      body: formData,
      cache: "no-store",
    });

    if (!response.ok) {
      const errorMessage = await getErrorMessage(response);

      if (response.status === 401) {
        const cookieStore = await cookies();
        cookieStore.delete("access_token");
      }

      return {
        success: false,
        error: errorMessage,
        data: undefined,
      };
    }

    const responseData = await response.json();

    if (responseData.ok !== undefined && responseData.data !== undefined) {
      return {
        success: responseData.ok,
        error: responseData.ok ? undefined : responseData.message,
        data: responseData.data,
      };
    }

    return {
      success: true,
      error: undefined,
      data: responseData,
    };
  } catch (error) {
    console.error("Error en fetchWithAuthFormData:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error de conexión",
      data: undefined,
    };
  }
}
