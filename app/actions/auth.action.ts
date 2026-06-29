// app/actions/auth.actions.ts
"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { cookies } from "next/headers";
import { fetchWithoutAuth } from "@/lib/fetch-utils";

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

// ============================================
// LOGIN - Iniciar sesión (SIN autenticación)
// ============================================
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

  // 2. Llamar a FastAPI usando fetchWithoutAuth
  const result = await fetchWithoutAuth<{
    access_token: string;
    token_type: string;
    user: {
      id: number;
      username: string;
      email: string;
    };
  }>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({
      username: validated.data.username,
      password: validated.data.password,
    }),
  });

  // 3. Manejar errores
  if (!result.success || !result.data) {
    return { error: result.error || "Credenciales incorrectas" };
  }

  // 4. Guardar el token en cookie
  const cookieStore = await cookies();
  cookieStore.set("access_token", result.data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: Number(process.env.JWT_EXPIRES_MIN) * 60,
    path: "/",
  });

  // 5. Redirigir
  redirect("/user/audios");
}

// ============================================
// LOGOUT - Cerrar sesión
// ============================================
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  redirect("/login");
}
