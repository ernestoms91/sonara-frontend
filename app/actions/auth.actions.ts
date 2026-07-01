// app/actions/auth.action.ts
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
// LOGIN - Iniciar sesión
// ============================================
export async function loginAction(prevState: LoginState, formData: FormData) {
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

  const result = await fetchWithoutAuth<{
    access_token: string;
    refresh_token: string;
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

  if (!result.success || !result.data) {
    return { error: result.error || "Credenciales incorrectas" };
  }

  const cookieStore = await cookies();

  cookieStore.set("access_token", result.data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: Number(process.env.JWT_EXPIRES_MIN) * 60 || 60 * 15,
    path: "/",
  });

  cookieStore.set("refresh_token", result.data.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  redirect("/user/audios");
}

// ============================================
// LOGOUT - Cerrar sesión
// ============================================
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
  redirect("/");
}
