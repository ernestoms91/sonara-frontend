// app/api/audios/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.BACKEND_URL;

export async function GET(request: NextRequest) {
  try {
    // Obtener token de la cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    // Verificar token
    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page") || "1";
    const size = searchParams.get("size") || "10";

    // Enviar token al backend
    const response = await fetch(
      `${API_BASE_URL}/api/v1/audio/all?page=${page}&size=${size}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ← Token
        },
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `Backend error: ${response.status}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error en API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
