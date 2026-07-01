"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
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
    <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
      <form action={formAction} className="space-y-6">
        <FieldGroup>
          {/* Campo username */}
          <Field>
            <FieldLabel htmlFor="username">Nombre de usuario</FieldLabel>
            <FieldContent>
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                placeholder="usuario123"
                aria-invalid={!!state?.errors?.username}
                disabled={isPending}
              />
              {state?.errors?.username && (
                <FieldError errors={state.errors.username} />
              )}
            </FieldContent>
          </Field>

          {/* Campo Contraseña */}
          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="password">Contraseña</FieldLabel>
              <Link
                href="/forgot-password"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <FieldContent>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="pr-10"
                  aria-invalid={!!state?.errors?.password}
                  disabled={isPending}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive text-center">
                {state.error}
              </p>
            </div>
          )}
        </FieldGroup>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Iniciando sesión...
            </>
          ) : (
            "Iniciar Sesión"
          )}
        </Button>
      </form>
    </div>
  );
}
