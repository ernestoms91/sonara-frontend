// app/actions/profile.actions.ts
"use server";

import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL;

export async function getProfiles() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return { success: false, error: "No autorizado", profiles: [] };
    }

    const response = await fetch(
      `${BACKEND_URL}/api/v1/profile/?page=1&size=50&active_only=true`,
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
        error: "Error al cargar perfiles",
        profiles: [],
      };
    }

    const data = await response.json();

    return {
      success: true,
      profiles: data.data?.items || [],
    };
  } catch (error) {
    console.error("Error en getProfiles:", error);
    return { success: false, error: "Error de conexión", profiles: [] };
  }
}
