// components/features/profiles/ProfilesClient.tsx
"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle,
  User,
  Calendar,
  Layers,
  Cpu,
  Trash2,
  Power,
  PowerOff,
} from "lucide-react";
import { Pagination } from "@/components/common/Pagination";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Profile } from "@/types/api";
import {
  deleteProfile,
  deactivateProfile,
  activateProfile,
} from "@/app/actions/profile.actions";
import { CreateProfileDialog } from "@/components/features/profiles/CreateProfileDialog";

interface ProfilesClientProps {
  initialData: {
    success: boolean;
    error?: string;
    data?: {
      items: Profile[];
      total: number;
      page: number;
      size: number;
      pages: number;
    };
  };
  currentPage: number;
}

export default function ProfilesClient({
  initialData,
  currentPage,
}: ProfilesClientProps) {
  const router = useRouter();
  const [expandedProfile, setExpandedProfile] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<Profile | null>(null);

  const allItems = initialData.data?.items || [];
  const [allProfiles, setAllProfiles] = useState<Profile[]>(allItems);
  const [profiles, setProfiles] = useState<Profile[]>(allItems);
  const [totalItems, setTotalItems] = useState(initialData.data?.total || 0);
  const pageSize = initialData.data?.size || 50;

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const handleProfileCreated = (newProfile: Profile) => {
    const newAllProfiles = [...allProfiles, newProfile].sort((a, b) =>
      a.name.localeCompare(b.name),
    );
    setAllProfiles(newAllProfiles);

    const startIndex = (currentPage - 1) * pageSize;
    const pageProfiles = newAllProfiles.slice(
      startIndex,
      startIndex + pageSize,
    );
    setProfiles(pageProfiles);
    setTotalItems((prev) => prev + 1);
  };

  const handlePageChange = (page: number) => {
    router.push(`/user/profiles?page=${page}&size=${pageSize}`);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleExpand = (id: number) => {
    setExpandedProfile(expandedProfile === id ? null : id);
  };

  const handleToggleActive = (profile: Profile) => {
    startTransition(async () => {
      try {
        const result = profile.active
          ? await deactivateProfile(profile.id)
          : await activateProfile(profile.id);

        if (!result.success) {
          toast.error(result.error || "Error al cambiar estado");
          return;
        }

        toast.success(
          profile.active
            ? `Perfil "${profile.name}" desactivado`
            : `Perfil "${profile.name}" activado`,
        );

        setAllProfiles((prev) =>
          prev.map((p) =>
            p.id === profile.id ? { ...p, active: !p.active } : p,
          ),
        );

        setProfiles((prev) =>
          prev.map((p) =>
            p.id === profile.id ? { ...p, active: !p.active } : p,
          ),
        );
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Error al cambiar estado",
        );
      }
    });
  };

  const handleDeleteClick = (profile: Profile) => {
    setProfileToDelete(profile);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!profileToDelete) return;

    startTransition(async () => {
      try {
        const result = await deleteProfile(profileToDelete.id, false);

        if (!result.success) {
          toast.error(result.error || "Error al eliminar perfil");
          return;
        }

        toast.success(`Perfil "${profileToDelete.name}" eliminado`);
        setDeleteDialogOpen(false);
        setProfileToDelete(null);

        // Actualizar estado local
        const newAllProfiles = allProfiles.filter(
          (p) => p.id !== profileToDelete.id,
        );
        setAllProfiles(newAllProfiles);
        setTotalItems((prev) => prev - 1);

        const startIndex = (currentPage - 1) * pageSize;
        const pageProfiles = newAllProfiles.slice(
          startIndex,
          startIndex + pageSize,
        );

        if (pageProfiles.length === 0 && currentPage > 1) {
          // La key en page.tsx se actualizará porque el total cambió
          router.push(
            `/user/profiles?page=${currentPage - 1}&size=${pageSize}`,
          );
        } else {
          setProfiles(pageProfiles);
        }
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Error al eliminar perfil",
        );
      }
    });
  };

  const getStatusBadge = (active: boolean) => {
    return active ? (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
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

  if (totalItems === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center px-4">
          <User className="size-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">
            No hay perfiles disponibles
          </p>
          <CreateProfileDialog onSuccess={handleProfileCreated} />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-full flex-col">
        <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md px-3 py-2 sm:px-4 sm:py-3 md:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-base font-bold sm:text-xl md:text-2xl">
              Perfiles de Voz
            </h1>
            <CreateProfileDialog onSuccess={handleProfileCreated} />
          </div>
        </header>

        <div className="flex-1 overflow-auto p-3 sm:p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <div className="hidden lg:block glass-panel rounded-2xl overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/30">
                      <th className="px-4 py-3 text-xs font-mono text-muted-foreground uppercase tracking-widest">
                        ID
                      </th>
                      <th className="px-4 py-3 text-xs font-mono text-muted-foreground uppercase tracking-widest">
                        Nombre
                      </th>
                      <th className="px-4 py-3 text-xs font-mono text-muted-foreground uppercase tracking-widest">
                        Idioma
                      </th>
                      <th className="px-4 py-3 text-xs font-mono text-muted-foreground uppercase tracking-widest">
                        Modelo
                      </th>
                      <th className="px-4 py-3 text-xs font-mono text-muted-foreground uppercase tracking-widest text-center">
                        Estado
                      </th>
                      <th className="px-4 py-3 text-xs font-mono text-muted-foreground uppercase tracking-widest text-right">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {profiles.map((profile: Profile) => (
                      <React.Fragment key={profile.id}>
                        <tr className="hover:bg-muted/20 transition-colors group">
                          <td className="px-4 py-4">
                            <span className="font-mono text-sm text-primary bg-primary/10 px-2 py-1 rounded">
                              #{String(profile.id).padStart(3, "0")}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleExpand(profile.id)}
                                className="flex items-center gap-2 hover:text-primary transition-colors"
                              >
                                <span className="font-medium text-foreground">
                                  {profile.name}
                                </span>
                                {expandedProfile === profile.id ? (
                                  <ChevronUp className="size-4 text-muted-foreground" />
                                ) : (
                                  <ChevronDown className="size-4 text-muted-foreground" />
                                )}
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm">
                              {profile.language || "No especificado"}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-xs font-mono text-muted-foreground">
                              {profile.model_type || "No especificado"}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            {getStatusBadge(profile.active)}
                          </td>
                          <td className="px-4 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 rounded-lg hover:bg-primary/10 hover:text-primary text-muted-foreground transition-all"
                                title={
                                  profile.active ? "Desactivar" : "Activar"
                                }
                                onClick={() => handleToggleActive(profile)}
                                disabled={isPending}
                              >
                                {profile.active ? (
                                  <PowerOff className="size-4" />
                                ) : (
                                  <Power className="size-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 rounded-lg hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-all"
                                title="Eliminar"
                                onClick={() => handleDeleteClick(profile)}
                                disabled={isPending}
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                        {expandedProfile === profile.id && (
                          <tr>
                            <td colSpan={6} className="px-4 py-3 bg-muted/10">
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-3">
                                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Texto de referencia:
                                  </span>
                                  <div className="flex flex-wrap gap-2">
                                    {profile.connectors_ready && (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                        <CheckCircle className="size-3" />
                                        Conectores
                                      </span>
                                    )}
                                    {profile.hours_ready && (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20">
                                        <CheckCircle className="size-3" />
                                        Horas
                                      </span>
                                    )}
                                    {profile.minutes_ready && (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-500 border border-purple-500/20">
                                        <CheckCircle className="size-3" />
                                        Minutos
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-background/50 p-3 rounded-lg border border-border/30">
                                  {profile.ref_text ||
                                    "Sin texto de referencia"}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Layers className="size-3" />
                                    Folder: {profile.folder_id}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Cpu className="size-3" />
                                    Modelo: {profile.model_type}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="size-3" />
                                    Creado:{" "}
                                    {new Date(
                                      profile.created_at,
                                    ).toLocaleString()}
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
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  className="glass-panel rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-3 sm:p-4 hover:border-primary/20 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs sm:text-sm text-primary bg-primary/10 px-2 py-0.5 rounded">
                        #{String(profile.id).padStart(3, "0")}
                      </span>
                      <span className="font-semibold text-foreground">
                        {profile.name}
                      </span>
                      {getStatusBadge(profile.active)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 sm:size-8 rounded-lg hover:bg-primary/10 hover:text-primary text-muted-foreground transition-all"
                        title={profile.active ? "Desactivar" : "Activar"}
                        onClick={() => handleToggleActive(profile)}
                        disabled={isPending}
                      >
                        {profile.active ? (
                          <PowerOff className="size-3.5 sm:size-4" />
                        ) : (
                          <Power className="size-3.5 sm:size-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 sm:size-8 rounded-lg hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-all"
                        title="Eliminar"
                        onClick={() => handleDeleteClick(profile)}
                        disabled={isPending}
                      >
                        <Trash2 className="size-3.5 sm:size-4" />
                      </Button>
                      <button
                        onClick={() => toggleExpand(profile.id)}
                        className="p-1 rounded-lg hover:bg-muted transition-colors"
                      >
                        {expandedProfile === profile.id ? (
                          <ChevronUp className="size-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="size-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-1 text-xs sm:text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-foreground">
                        Idioma:
                      </span>
                      {profile.language || "No especificado"}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-foreground">
                        Modelo:
                      </span>
                      <span className="font-mono text-xs truncate">
                        {profile.model_type || "No especificado"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    {profile.connectors_ready && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        <CheckCircle className="size-3" />
                        Conectores
                      </span>
                    )}
                    {profile.hours_ready && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20">
                        <CheckCircle className="size-3" />
                        Horas
                      </span>
                    )}
                    {profile.minutes_ready && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-500 border border-purple-500/20">
                        <CheckCircle className="size-3" />
                        Minutos
                      </span>
                    )}
                  </div>

                  {expandedProfile === profile.id && (
                    <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Texto de referencia:
                      </p>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-background/50 p-3 rounded-lg border border-border/30">
                        {profile.ref_text || "Sin texto de referencia"}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Layers className="size-3" />
                          {profile.folder_id.slice(0, 8)}...
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          {new Date(profile.created_at).toLocaleDateString()}
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
              itemLabel="perfil"
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Eliminar perfil"
        description={`¿Estás seguro de que quieres eliminar el perfil "${profileToDelete?.name}"?`}
        confirmText="Eliminar"
        destructive={true}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
