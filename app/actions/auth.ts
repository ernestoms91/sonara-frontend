"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { cookies } from "next/headers";
import type { LoginResponse } from "@/types/api";

type LoginState = {
  errors?: Record<string, { message: string }[]>;
  error?: string;
} | null;

const loginSchema = z.object({
  username: z
    .string()
    .min(4, "El nombre de usuario debe tener al menos 4 caracteres"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export async function loginAction(prevState: LoginState, formData: FormData) {
  // 1. Validar los datos
  const validated = loginSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!validated.success) {
    const errors: Record<string, { message: string }[]> = {};

    Object.entries(validated.error.flatten().fieldErrors).forEach(
      ([key, value]) => {
        if (value) {
          errors[key] = value.map((msg) => ({ message: msg }));
        }
      },
    );

    return { errors };
  }

  // 2. Llamar a FastAPI
  const BACKEND_URL = process.env.BACKEND_URL;

  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: validated.data.username,
        password: validated.data.password,
      }),
    });

    const result: LoginResponse = await response.json();

    if (!response.ok) {
      return { error: result.message || "Credenciales incorrectas" };
    }

    //  Usar result.data.access_token (no data.access_token)
    const token = result.data.access_token;

    // 3. Guardar el token en cookie
    const cookieStore = await cookies();
    cookieStore.set("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: Number(process.env.JWT_EXPIRES_MIN) * 60,
      path: "/",
    });

    //  No hacer return, solo salir del try
    // El redirect va FUERA del try/catch
  } catch (error) {
    console.error("Error de red:", error);
    return { error: "Error de conexión con el servidor" };
  }

  // 4. Redirigir
  redirect("/user/dashboard");
}
