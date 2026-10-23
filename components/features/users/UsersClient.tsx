// components/features/users/UsersClient.tsx
"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronUp,
  User,
  Calendar,
  Shield,
  Mail,
  Trash2,
  Power,
  PowerOff,
  Pencil,
} from "lucide-react";
import { Pagination } from "@/components/common/Pagination";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { User as UserType } from "@/types/api";
import {
  toggleUserActive,
  deleteUser,
  enableUser,
} from "@/app/actions/user.actions";
import { CreateUserDialog } from "./CreateUserDialog";
import { EditUserDialog } from "./EditUserDialog";

interface UsersClientProps {
  initialData: {
    success: boolean;
    error?: string;
    data?: {
      items: UserType[];
      total: number;
      page: number;
      size: number;
      pages: number;
    };
  };
  currentPage: number;
}

export default function UsersClient({
  initialData,
  currentPage,
}: UsersClientProps) {
  const router = useRouter();
  const [expandedUser, setExpandedUser] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserType | null>(null);

  const allItems = initialData.data?.items || [];
  const [allUsers, setAllUsers] = useState<UserType[]>(allItems);
  const [users, setUsers] = useState<UserType[]>(allItems);
  const [totalItems, setTotalItems] = useState(initialData.data?.total || 0);
  const pageSize = initialData.data?.size || 50;

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const handleUserCreated = (newUser: UserType) => {
    const newAllUsers = [...allUsers, newUser].sort((a, b) =>
      a.username.localeCompare(b.username),
    );
    setAllUsers(newAllUsers);

    const startIndex = (currentPage - 1) * pageSize;
    const pageUsers = newAllUsers.slice(startIndex, startIndex + pageSize);
    setUsers(pageUsers);
    setTotalItems((prev) => prev + 1);

    router.refresh();
  };

  const handleUserUpdated = (updatedUser: UserType) => {
    setAllUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
    );
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
    );
  };

  const handlePageChange = (page: number) => {
    router.push(`/user/users?page=${page}&size=${pageSize}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleExpand = (id: number) => {
    setExpandedUser(expandedUser === id ? null : id);
  };

  const handleToggleActive = (user: UserType) => {
    startTransition(async () => {
      try {
        let result;
        if (user.is_active) {
          // Desactivar
          result = await deleteUser(user.id);
        } else {
          // Activar
          result = await enableUser(user.id);
        }

        if (!result.success) {
          toast.error(result.error || "Error al cambiar estado");
          return;
        }

        toast.success(
          user.is_active
            ? `Usuario "${user.username}" desactivado`
            : `Usuario "${user.username}" activado`,
        );

        // Actualizar estado local
        setAllUsers((prev) =>
          prev.map((u) =>
            u.id === user.id ? { ...u, is_active: !u.is_active } : u,
          ),
        );
        setUsers((prev) =>
          prev.map((u) =>
            u.id === user.id ? { ...u, is_active: !u.is_active } : u,
          ),
        );
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Error al cambiar estado",
        );
      }
    });
  };

  const handleDeleteClick = (user: UserType) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!userToDelete) return;

    startTransition(async () => {
      try {
        const result = await deleteUser(userToDelete.id);

        if (!result.success) {
          toast.error(result.error || "Error al deshabilitar usuario");
          return;
        }

        toast.success(`Usuario "${userToDelete.username}" deshabilitado`);
        setDeleteDialogOpen(false);
        setUserToDelete(null);

        const newAllUsers = allUsers.filter((u) => u.id !== userToDelete.id);
        setAllUsers(newAllUsers);
        setTotalItems((prev) => prev - 1);

        const startIndex = (currentPage - 1) * pageSize;
        const pageUsers = newAllUsers.slice(startIndex, startIndex + pageSize);

        if (pageUsers.length === 0 && currentPage > 1) {
          router.push(`/user/users?page=${currentPage - 1}&size=${pageSize}`);
        } else {
          setUsers(pageUsers);
        }
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Error al deshabilitar usuario",
        );
      }
    });
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
        <span className="size-1.5 rounded-full bg-emerald-500" />
        Activo
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
        <span className="size-1.5 rounded-full bg-muted-foreground/50" />
        Inactivo
      </span>
    );
  };

  const getAdminBadge = (isAdmin: boolean) => {
    return isAdmin ? (
      <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">
        <Shield className="size-3" />
        Admin
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
        <User className="size-3" />
        Usuario
      </span>
    );
  };

  const pageHeader = (
    <header className="sticky top-16 z-20 border-b border-border/70 bg-background/80 backdrop-blur-xl md:top-0">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between md:px-6 lg:px-8">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Administración
          </p>
          <h1 className="mt-0.5 text-xl font-semibold text-foreground sm:text-2xl">
            Usuarios
          </h1>
        </div>
        <CreateUserDialog onSuccess={handleUserCreated} />
      </div>
    </header>
  );

  if (totalItems === 0) {
    return (
      <div className="flex flex-1 flex-col">
        {pageHeader}
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="flex max-w-md flex-col items-center rounded-2xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
              <User className="size-6 text-primary" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-foreground">
              No hay usuarios disponibles
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              Crea el primer usuario para que tu equipo pueda acceder a Sonara.
            </p>
            <div className="mt-6">
              <CreateUserDialog onSuccess={handleUserCreated} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-1 flex-col">
        {pageHeader}

        <div className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl">
            <div className="hidden overflow-hidden rounded-2xl border border-border bg-card shadow-sm lg:block">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                        ID
                      </th>
                      <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                        Usuario
                      </th>
                      <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                        Email
                      </th>
                      <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                        Nombre
                      </th>
                      <th className="px-4 py-3 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                        Rol
                      </th>
                      <th className="px-4 py-3 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                        Estado
                      </th>
                      <th className="px-4 py-3 text-right text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {users.map((user: UserType) => (
                      <React.Fragment key={user.id}>
                        <tr className="group transition-colors hover:bg-muted/40">
                          <td className="px-4 py-4">
                            <span className="font-mono text-sm text-primary bg-primary/10 px-2 py-1 rounded">
                              #{String(user.id).padStart(3, "0")}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleExpand(user.id)}
                                className="flex items-center gap-2 hover:text-primary transition-colors"
                              >
                                <span className="font-medium text-foreground">
                                  {user.username}
                                </span>
                                {expandedUser === user.id ? (
                                  <ChevronUp className="size-4 text-muted-foreground" />
                                ) : (
                                  <ChevronDown className="size-4 text-muted-foreground" />
                                )}
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <Mail className="size-3.5" />
                              {user.email}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm text-muted-foreground">
                              {user.full_name || "—"}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            {getAdminBadge(user.is_admin)}
                          </td>
                          <td className="px-4 py-4 text-center">
                            {getStatusBadge(user.is_active)}
                          </td>
                          <td className="px-4 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {/* ✅ Botón Activar/Desactivar usando toggle */}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 rounded-lg hover:bg-primary/10 hover:text-primary text-muted-foreground transition-all"
                                title={
                                  user.is_active ? "Desactivar" : "Activar"
                                }
                                onClick={() => handleToggleActive(user)}
                                disabled={isPending}
                              >
                                {user.is_active ? (
                                  <PowerOff className="size-4" />
                                ) : (
                                  <Power className="size-4" />
                                )}
                              </Button>

                              {/* ✅ Botón Editar (siempre visible) */}
                              <EditUserDialog
                                user={user}
                                onSuccess={handleUserUpdated}
                              />

                              {/* ✅ Botón Deshabilitar (solo para usuarios activos no admin) */}
                              {user.is_active && !user.is_admin && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-8 rounded-lg hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-all"
                                  title="Deshabilitar"
                                  onClick={() => handleDeleteClick(user)}
                                  disabled={isPending}
                                >
                                  <Trash2 className="size-4" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                        {expandedUser === user.id && (
                          <tr>
                            <td colSpan={7} className="px-4 py-3 bg-muted/10">
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-4 text-sm">
                                  <span className="flex items-center gap-2">
                                    <span className="font-medium text-muted-foreground">
                                      Usuario:
                                    </span>
                                    <span className="text-foreground">
                                      @{user.username}
                                    </span>
                                  </span>
                                  <span className="flex items-center gap-2">
                                    <span className="font-medium text-muted-foreground">
                                      Nombre:
                                    </span>
                                    <span className="text-foreground">
                                      {user.full_name || "No especificado"}
                                    </span>
                                  </span>
                                  <span className="flex items-center gap-2">
                                    <span className="font-medium text-muted-foreground">
                                      Email:
                                    </span>
                                    <span className="text-foreground">
                                      {user.email}
                                    </span>
                                  </span>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="size-3" />
                                    Creado:{" "}
                                    {new Date(user.created_at).toLocaleString()}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="size-3" />
                                    Actualizado:{" "}
                                    {new Date(user.updated_at).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="lg:hidden space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="rounded-xl border border-border bg-card p-3 shadow-sm transition-colors hover:border-primary/30 sm:p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs sm:text-sm text-primary bg-primary/10 px-2 py-0.5 rounded">
                        #{String(user.id).padStart(3, "0")}
                      </span>
                      <span className="font-semibold text-foreground">
                        {user.username}
                      </span>
                      {getAdminBadge(user.is_admin)}
                      {getStatusBadge(user.is_active)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 sm:size-8 rounded-lg hover:bg-primary/10 hover:text-primary text-muted-foreground transition-all"
                        title={user.is_active ? "Desactivar" : "Activar"}
                        onClick={() => handleToggleActive(user)}
                        disabled={isPending}
                      >
                        {user.is_active ? (
                          <PowerOff className="size-3.5 sm:size-4" />
                        ) : (
                          <Power className="size-3.5 sm:size-4" />
                        )}
                      </Button>
                      <EditUserDialog
                        user={user}
                        onSuccess={handleUserUpdated}
                      />
                      {user.is_active && !user.is_admin && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 sm:size-8 rounded-lg hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-all"
                          title="Deshabilitar"
                          onClick={() => handleDeleteClick(user)}
                          disabled={isPending}
                        >
                          <Trash2 className="size-3.5 sm:size-4" />
                        </Button>
                      )}
                      <button
                        onClick={() => toggleExpand(user.id)}
                        className="p-1 rounded-lg hover:bg-muted transition-colors"
                      >
                        {expandedUser === user.id ? (
                          <ChevronUp className="size-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="size-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                    <Mail className="size-3.5 shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>

                  {user.full_name && (
                    <div className="mt-1 text-xs text-muted-foreground">
                      <span className="font-medium">Nombre:</span>{" "}
                      {user.full_name}
                    </div>
                  )}

                  {expandedUser === user.id && (
                    <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
                      <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <span className="font-medium">Usuario:</span>@
                          {user.username}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="font-medium">Nombre:</span>
                          {user.full_name || "No especificado"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          {new Date(user.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemLabel="usuario"
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Deshabilitar usuario"
        description={`¿Estás seguro de que quieres deshabilitar al usuario "${userToDelete?.username}"?`}
        confirmText="Deshabilitar"
        destructive={true}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
