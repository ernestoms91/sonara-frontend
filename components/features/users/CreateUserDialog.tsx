// components/features/users/CreateUserDialog.tsx
"use client";

import { useState, useTransition } from "react";
import { Plus, Loader2, Check, X } from "lucide-react";
import { toast } from "sonner";
import { createUser } from "@/app/actions/user.actions";
import { User } from "@/types/api";
import {
  validatePassword,
  validateUsername,
  validateEmail,
  validateFullName,
} from "@/lib/validations";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface CreateUserDialogProps {
  onSuccess?: (newUser: User) => void;
}

export function CreateUserDialog({ onSuccess }: CreateUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    full_name?: string;
    general?: string;
  }>({});

  // ✅ Validaciones en tiempo real
  const usernameValidation = validateUsername(username);
  const emailValidation = validateEmail(email);
  const passwordValidation = validatePassword(password);
  const fullNameValidation = validateFullName(fullName);

  const resetForm = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setFullName("");
    setIsActive(true);
    setIsAdmin(false);
    setErrors({});
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
    }
    setOpen(newOpen);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // ✅ Validaciones en el cliente (UX)
    const newErrors: typeof errors = {};
    if (!usernameValidation.isValid) {
      newErrors.username = usernameValidation.error;
    }
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error;
    }
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors.join(", ");
    }
    if (!fullNameValidation.isValid) {
      newErrors.full_name = fullNameValidation.error;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    startTransition(async () => {
      try {
        const result = await createUser({
          username: username.trim(),
          email: email.trim(),
          password,
          full_name: fullName.trim(),
          is_active: isActive,
          is_admin: isAdmin,
        });

        if (!result.success) {
          const errorMsg = result.error || "Error al crear usuario";
          setErrors({ general: errorMsg });
          toast.error(errorMsg);
          return;
        }

        if (!result.data) {
          setErrors({ general: "No se recibieron datos del usuario" });
          toast.error("Error al crear usuario");
          return;
        }

        toast.success(`Usuario "${result.data.username}" creado`);

        if (onSuccess) {
          onSuccess(result.data);
        }

        resetForm();
        setOpen(false);
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Error al crear usuario";
        setErrors({ general: errorMsg });
        toast.error(errorMsg);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="size-4" />
          Nuevo Usuario
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Crear nuevo usuario</DialogTitle>
            <DialogDescription>
              Completa los datos para crear un nuevo usuario.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {errors.general && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
                {errors.general}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Usuario *</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ej: juanperez"
                disabled={isPending}
                className={errors.username ? "border-destructive" : ""}
              />
              {errors.username && (
                <p className="text-xs text-destructive">{errors.username}</p>
              )}
              {username && !errors.username && usernameValidation.isValid && (
                <p className="text-xs text-emerald-500">✓ Usuario válido</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                disabled={isPending}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
              {email && !errors.email && emailValidation.isValid && (
                <p className="text-xs text-emerald-500">✓ Email válido</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Nombre completo *</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Juan Pérez"
                disabled={isPending}
                className={errors.full_name ? "border-destructive" : ""}
              />
              {errors.full_name && (
                <p className="text-xs text-destructive">{errors.full_name}</p>
              )}
              {fullName && !errors.full_name && fullNameValidation.isValid && (
                <p className="text-xs text-emerald-500">✓ Nombre válido</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña *</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isPending}
                className={errors.password ? "border-destructive" : ""}
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password}</p>
              )}

              {/* ✅ Requisitos de contraseña en tiempo real */}
              {password && (
                <div className="mt-2 space-y-1 text-xs">
                  <p className="font-medium text-muted-foreground">
                    Requisitos de la contraseña:
                  </p>
                  <ul className="space-y-0.5">
                    {[
                      {
                        label: "Mínimo 8 caracteres",
                        check: password.length >= 8,
                      },
                      {
                        label: "Al menos una mayúscula",
                        check: /[A-Z]/.test(password),
                      },
                      {
                        label: "Al menos una minúscula",
                        check: /[a-z]/.test(password),
                      },
                      {
                        label: "Al menos un número",
                        check: /[0-9]/.test(password),
                      },
                      {
                        label: "Al menos un carácter especial (!@#$%^&*)",
                        check: /[!@#$%^&*(),.?":{}|<>]/.test(password),
                      },
                    ].map((req) => (
                      <li
                        key={req.label}
                        className={`flex items-center gap-1.5 ${
                          req.check
                            ? "text-emerald-500"
                            : "text-muted-foreground"
                        }`}
                      >
                        {req.check ? (
                          <Check className="size-3" />
                        ) : (
                          <X className="size-3" />
                        )}
                        {req.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="isActive"
                  checked={isActive}
                  onCheckedChange={(checked) => setIsActive(!!checked)}
                  disabled={isPending}
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                  Activo
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="isAdmin"
                  checked={isAdmin}
                  onCheckedChange={(checked) => setIsAdmin(!!checked)}
                  disabled={isPending}
                />
                <Label htmlFor="isAdmin" className="cursor-pointer">
                  Administrador
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                "Crear Usuario"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
