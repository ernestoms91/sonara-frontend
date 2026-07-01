// components/features/users/EditUserDialog.tsx
"use client";

import { useState, useTransition } from "react";
import { Pencil, Loader2, Check, X } from "lucide-react";
import { toast } from "sonner";
import { updateUser } from "@/app/actions/user.actions";
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

interface EditUserDialogProps {
  user: User;
  onSuccess?: (updatedUser: User) => void;
}

export function EditUserDialog({ user, onSuccess }: EditUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState(user.full_name || "");
  const [isActive, setIsActive] = useState(user.is_active);
  const [isAdmin, setIsAdmin] = useState(user.is_admin);

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

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setUsername(user.username);
      setEmail(user.email);
      setPassword("");
      setFullName(user.full_name || "");
      setIsActive(user.is_active);
      setIsAdmin(user.is_admin);
      setErrors({});
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
    if (password && !passwordValidation.isValid) {
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

    const updateData: {
      username?: string;
      email?: string;
      password?: string;
      full_name?: string;
      is_active?: boolean;
      is_admin?: boolean;
    } = {};

    if (username !== user.username) updateData.username = username.trim();
    if (email !== user.email) updateData.email = email.trim();
    if (password) updateData.password = password;
    if (fullName !== user.full_name) updateData.full_name = fullName.trim();
    if (isActive !== user.is_active) updateData.is_active = isActive;
    if (isAdmin !== user.is_admin) updateData.is_admin = isAdmin;

    if (Object.keys(updateData).length === 0) {
      toast.info("No hay cambios para guardar");
      setOpen(false);
      return;
    }

    startTransition(async () => {
      try {
        const result = await updateUser(user.id, updateData);

        if (!result.success) {
          const errorMsg = result.error || "Error al actualizar usuario";
          setErrors({ general: errorMsg });
          toast.error(errorMsg);
          return;
        }

        if (!result.data) {
          setErrors({ general: "No se recibieron datos del usuario" });
          toast.error("Error al actualizar usuario");
          return;
        }

        toast.success(`Usuario "${result.data.username}" actualizado`);

        if (onSuccess) {
          onSuccess(result.data);
        }

        setOpen(false);
      } catch (error) {
        const errorMsg =
          error instanceof Error
            ? error.message
            : "Error al actualizar usuario";
        setErrors({ general: errorMsg });
        toast.error(errorMsg);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 rounded-lg hover:bg-primary/10 hover:text-primary text-muted-foreground transition-all"
          title="Editar"
        >
          <Pencil className="size-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editar usuario</DialogTitle>
            <DialogDescription>
              Modifica los datos del usuario &quot;{user.username}&quot;.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {errors.general && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
                {errors.general}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="edit-username">Usuario *</Label>
              <Input
                id="edit-username"
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
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                id="edit-email"
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
              <Label htmlFor="edit-fullName">Nombre completo *</Label>
              <Input
                id="edit-fullName"
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
              <Label htmlFor="edit-password">
                Contraseña
                <span className="text-xs text-muted-foreground ml-2">
                  (dejar vacío para no cambiar)
                </span>
              </Label>
              <Input
                id="edit-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nueva contraseña (opcional)"
                disabled={isPending}
                className={errors.password ? "border-destructive" : ""}
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password}</p>
              )}

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
                  id="edit-isActive"
                  checked={isActive}
                  onCheckedChange={(checked) => setIsActive(!!checked)}
                  disabled={isPending}
                />
                <Label htmlFor="edit-isActive" className="cursor-pointer">
                  Activo
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="edit-isAdmin"
                  checked={isAdmin}
                  onCheckedChange={(checked) => setIsAdmin(!!checked)}
                  disabled={isPending}
                />
                <Label htmlFor="edit-isAdmin" className="cursor-pointer">
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
                  Guardando...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
