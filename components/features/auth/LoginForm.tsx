"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useState } from "react";
import { CircleAlert, Eye, EyeOff, Loader2, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginAction } from "@/app/actions/auth.actions";

import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card/90 p-6 shadow-2xl shadow-black/5 backdrop-blur-sm sm:p-8 dark:shadow-black/40">
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/60 to-transparent" />

      <div className="mb-7 text-center">
        <Link
          href="/"
          className="mx-auto flex w-fit items-center gap-2.5"
          aria-label="Volver a Sonara"
        >
          <span className="flex size-10 items-center justify-center rounded-full border border-border bg-background shadow-sm">
            <Image
              alt="Sonara"
              className="size-6 w-auto dark:invert"
              src="/screen.png"
              width={24}
              height={24}
              priority
            />
          </span>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            Sonara
          </span>
        </Link>

        <h1 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">
          Bienvenido de nuevo
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Ingresa a tu panel para seguir creando locuciones.
        </p>
      </div>

      <form action={formAction} className="space-y-6">
        <FieldGroup>
          {/* Usuario */}
          <Field>
            <FieldLabel htmlFor="username" className="text-sm font-medium">
              Nombre de usuario
            </FieldLabel>
            <FieldContent>
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                placeholder="tu.usuario"
                className="h-10 bg-background/60"
                aria-invalid={!!state?.errors?.username}
                disabled={isPending}
                autoFocus
              />
              {state?.errors?.username && (
                <FieldError errors={state.errors.username} />
              )}
            </FieldContent>
          </Field>

          {/* Contraseña */}
          <Field>
            <FieldLabel htmlFor="password" className="text-sm font-medium">
              Contraseña
            </FieldLabel>
            <FieldContent>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="h-10 bg-background/60 pr-10"
                  aria-invalid={!!state?.errors?.password}
                  disabled={isPending}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                  disabled={isPending}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              {state?.errors?.password && (
                <FieldError errors={state.errors.password} />
              )}
            </FieldContent>
          </Field>

          {/* Error general */}
          {state?.error && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-destructive/10 p-3"
            >
              <CircleAlert className="mt-0.5 size-4 shrink-0 text-destructive" />
              <p className="text-sm leading-snug text-destructive">
                {state.error}
              </p>
            </div>
          )}
        </FieldGroup>

        <Button
          type="submit"
          className="h-10 w-full gap-2 text-sm shadow-sm"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Iniciando sesión…
            </>
          ) : (
            "Iniciar sesión"
          )}
        </Button>
      </form>

      <div className="mt-6 flex items-center justify-center gap-1.5 border-t border-border/70 pt-5 text-[11px] text-muted-foreground">
        <LockKeyhole className="size-3" />
        Conexión segura · Sonara AI
      </div>
    </div>
  );
}
