// components/features/boletin/ListarBoletinesClient.tsx
"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  FileText,
  Calendar,
  Clock,
  User,
  Edit,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  updateBoletin,
  getBoletinById,
  deleteBoletin,
} from "@/app/actions/boletin.actions";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pagination } from "@/components/common/Pagination";
import { EditarBoletinesModal } from "./EditarBoletinesModal";
import { VerBoletinModal } from "./VerBoletinModal";
import { AudioFromAPI, BoletinFromAPI, BoletinListData } from "@/types/api";

interface ListarBoletinesClientProps {
  initialData: {
    success: boolean;
    error?: string;
    data?: BoletinListData;
  };
  currentPage: number;
}

export default function ListarBoletinesClient({
  initialData,
  currentPage,
}: ListarBoletinesClientProps) {
  const router = useRouter();
  const [boletines, setBoletines] = useState(initialData.data?.items || []);
  const [isPending, startTransition] = useTransition();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [boletinToDelete, setBoletinToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);

  // Estados para edición
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingBoletin, setEditingBoletin] = useState<{
    id: number;
    audios: AudioFromAPI[];
    start_time: string;
  } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoadingAudios, setIsLoadingAudios] = useState(false);
  const [audiosCache, setAudiosCache] = useState<Map<number, AudioFromAPI[]>>(
    new Map(),
  );

  // Estados para ver detalles
  const [verModalOpen, setVerModalOpen] = useState(false);
  const [boletinDetail, setBoletinDetail] = useState<{
    id: number;
    start_time: string;
    created_by: string;
    created_at: string;
    updated_at: string;
    active: boolean;
    audio_count: number;
    audio_ids: string[];
    audios: AudioFromAPI[];
  } | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const {
    total,
    pages: totalPages,
    size: pageSize,
  } = initialData.data || {
    total: 0,
    pages: 0,
    size: 10,
  };

  const handleDeleteClick = useCallback(
    (boletinId: number, boletinName: string) => {
      setBoletinToDelete({ id: boletinId, name: boletinName });
      setDeleteDialogOpen(true);
    },
    [],
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!boletinToDelete) return;

    startTransition(async () => {
      try {
        const result = await deleteBoletin(boletinToDelete.id);

        if (result.success) {
          toast.success("Boletín eliminado correctamente");

          // Actualizar estado local optimistamente
          setBoletines((prev) =>
            prev.filter((b) => b.id !== boletinToDelete.id),
          );
          setAudiosCache((prev) => {
            const newCache = new Map(prev);
            newCache.delete(boletinToDelete.id);
            return newCache;
          });

          // Si no hay más boletines y estamos en página > 1, ir a la anterior
          if (boletines.length === 1 && currentPage > 1) {
            router.push(
              `/user/boletin/listar?page=${currentPage - 1}&size=${pageSize}`,
            );
          }
          //  La key en page.tsx forzará el remontaje cuando el total cambie
        } else {
          toast.error(result.error || "Error al eliminar el boletín");
        }
      } catch (error) {
        toast.error("Error al eliminar el boletín");
      }

      setDeleteDialogOpen(false);
      setBoletinToDelete(null);
    });
  }, [boletinToDelete, pageSize, boletines.length, currentPage, router]);

  const handlePageChange = (page: number) => {
    router.push(`/user/boletin/listar?page=${page}&size=${pageSize}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Función para abrir el modal de ver detalles
  const handleVerClick = useCallback(
    async (boletin: BoletinFromAPI) => {
      if (isLoadingDetail) return;

      if (boletin.audios && boletin.audios.length > 0) {
        setBoletinDetail({
          id: boletin.id,
          start_time: boletin.start_time,
          created_by: boletin.created_by,
          created_at: boletin.created_at,
          updated_at: boletin.updated_at,
          active: boletin.active,
          audio_count: boletin.audio_count,
          audio_ids: boletin.audio_ids,
          audios: boletin.audios,
        });
        setVerModalOpen(true);
        return;
      }

      setIsLoadingDetail(true);
      const loadingToast = toast.loading("Cargando detalles...");

      try {
        const result = await getBoletinById(boletin.id);

        if (!result.success || !result.data) {
          toast.error(result.error || "Error al cargar los detalles");
          toast.dismiss(loadingToast);
          return;
        }

        const boletinCompleto = result.data;

        if (!boletinCompleto.audios || boletinCompleto.audios.length === 0) {
          toast.error("Este boletín no tiene audios");
          toast.dismiss(loadingToast);
          return;
        }

        setAudiosCache((prev) =>
          new Map(prev).set(boletin.id, boletinCompleto.audios),
        );

        setBoletinDetail({
          id: boletinCompleto.id,
          start_time: boletinCompleto.start_time,
          created_by: boletinCompleto.created_by,
          created_at: boletinCompleto.created_at,
          updated_at: boletinCompleto.updated_at,
          active: boletinCompleto.active,
          audio_count: boletinCompleto.audio_count,
          audio_ids: boletinCompleto.audio_ids,
          audios: boletinCompleto.audios,
        });
        setVerModalOpen(true);
        toast.dismiss(loadingToast);
      } catch (error) {
        toast.error("Error al cargar los detalles");
        toast.dismiss(loadingToast);
        console.error(error);
      } finally {
        setIsLoadingDetail(false);
      }
    },
    [isLoadingDetail, audiosCache],
  );

  // Función para abrir el modal de edición
  const handleEditClick = useCallback(
    async (boletin: BoletinFromAPI) => {
      if (isLoadingAudios) return;

      if (!boletin.audio_ids || boletin.audio_ids.length === 0) {
        toast.error("Este boletín no tiene audios para editar");
        return;
      }

      if (audiosCache.has(boletin.id)) {
        const cachedAudios = audiosCache.get(boletin.id)!;
        setEditingBoletin({
          id: boletin.id,
          audios: cachedAudios,
          start_time: boletin.start_time,
        });
        setEditModalOpen(true);
        return;
      }

      setIsLoadingAudios(true);
      const loadingToast = toast.loading("Cargando audios...");

      try {
        const result = await getBoletinById(boletin.id);

        if (!result.success || !result.data) {
          toast.error(result.error || "Error al cargar los audios");
          toast.dismiss(loadingToast);
          return;
        }

        const boletinCompleto = result.data;

        if (!boletinCompleto.audios || boletinCompleto.audios.length === 0) {
          toast.error("Este boletín no tiene audios para editar");
          toast.dismiss(loadingToast);
          return;
        }

        setAudiosCache((prev) =>
          new Map(prev).set(boletin.id, boletinCompleto.audios),
        );

        setEditingBoletin({
          id: boletinCompleto.id,
          audios: boletinCompleto.audios,
          start_time: boletinCompleto.start_time,
        });
        setEditModalOpen(true);
        toast.dismiss(loadingToast);
        toast.success(`${boletinCompleto.audios.length} audios cargados`);
      } catch (error) {
        toast.error("Error al cargar los audios");
        toast.dismiss(loadingToast);
        console.error(error);
      } finally {
        setIsLoadingAudios(false);
      }
    },
    [isLoadingAudios, audiosCache],
  );

  // Función para confirmar la edición
  const handleEditConfirm = useCallback(
    async (orderedIds: string[], startTime: string) => {
      if (!editingBoletin) return;

      setIsEditing(true);
      try {
        const result = await updateBoletin(
          editingBoletin.id,
          orderedIds,
          startTime,
        );

        if (result.success) {
          toast.success("Boletín actualizado correctamente");

          setBoletines((prev) =>
            prev.map((b) =>
              b.id === editingBoletin.id ? { ...b, start_time: startTime } : b,
            ),
          );

          setEditModalOpen(false);
          setEditingBoletin(null);
        } else {
          toast.error(result.error || "Error al actualizar el boletín");
        }
      } catch (error) {
        toast.error("Error al actualizar el boletín");
      } finally {
        setIsEditing(false);
      }
    },
    [editingBoletin],
  );

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "PPP", { locale: es });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "hh:mm a", { locale: es });
    } catch {
      return dateStr;
    }
  };

  const getStatusBadge = (active: boolean) => {
    return active ? (
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

  const pageHeader = (
    <header className="sticky top-16 z-20 border-b border-border/70 bg-background/80 backdrop-blur-xl md:top-0">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between md:px-6 lg:px-8">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Producción
          </p>
          <h1 className="mt-0.5 text-xl font-semibold text-foreground sm:text-2xl">
            Boletines
          </h1>
        </div>

        <Button asChild size="sm" className="h-9 w-fit gap-1.5 px-3.5">
          <Link href="/user/boletin/crear">
            <FileText className="size-4" />
            Nuevo boletín
          </Link>
        </Button>
      </div>
    </header>
  );

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-[3px] border-primary border-t-transparent" />
      </div>
    );
  }

  if (total === 0) {
    return (
      <div className="flex flex-1 flex-col">
        {pageHeader}
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="flex max-w-md flex-col items-center rounded-2xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
              <FileText className="size-6 text-primary" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-foreground">
              Aún no tienes boletines
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              Combina tus audios en un boletín y prográmalo para tu emisora.
            </p>
            <Button asChild size="sm" className="mt-6 h-9 gap-1.5 px-3.5">
              <Link href="/user/boletin/crear">
                <FileText className="size-4" />
                Crear boletín
              </Link>
            </Button>
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
                        Fecha / Hora
                      </th>
                      <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                        Creador
                      </th>
                      <th className="px-4 py-3 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                        Contenido
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
                    {boletines.map((boletin) => (
                      <tr
                        key={boletin.id}
                        className="group transition-colors hover:bg-muted/40"
                      >
                        <td className="px-4 py-4">
                          <span className="font-mono text-sm text-primary bg-primary/10 px-2 py-1 rounded">
                            #{String(boletin.id).padStart(3, "0")}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col text-sm">
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Calendar className="size-3" />
                              {formatDate(boletin.start_time)}
                            </span>
                            <span className="flex items-center gap-1 text-xs font-medium text-primary">
                              <Clock className="size-3" />
                              {formatTime(boletin.start_time)}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <User className="size-3.5" />
                            {boletin.created_by || "Usuario"}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="whitespace-nowrap rounded-full border border-border/60 bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                            {boletin.audio_count} audio
                            {boletin.audio_count !== 1 ? "s" : ""}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          {getStatusBadge(boletin.active)}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 rounded-lg hover:bg-primary/10 hover:text-primary text-muted-foreground transition-all"
                              title="Editar"
                              onClick={() => handleEditClick(boletin)}
                              disabled={isLoadingAudios}
                            >
                              {isLoadingAudios ? (
                                <div className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                              ) : (
                                <Edit className="size-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 rounded-lg hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-all"
                              title="Eliminar"
                              onClick={() =>
                                handleDeleteClick(
                                  boletin.id,
                                  `Boletín ${formatDate(boletin.start_time)}`,
                                )
                              }
                            >
                              <Trash2 className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 rounded-lg hover:bg-primary/10 hover:text-primary text-muted-foreground transition-all"
                              title="Ver detalles"
                              onClick={() => handleVerClick(boletin)}
                              disabled={isLoadingDetail}
                            >
                              {isLoadingDetail ? (
                                <div className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                              ) : (
                                <ChevronRight className="size-4" />
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="lg:hidden space-y-3">
              {boletines.map((boletin) => (
                <div
                  key={boletin.id}
                  className="rounded-xl border border-border bg-card p-3 shadow-sm transition-colors hover:border-primary/30 sm:p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs sm:text-sm text-primary bg-primary/10 px-2 py-0.5 rounded">
                        #{String(boletin.id).padStart(3, "0")}
                      </span>
                      {getStatusBadge(boletin.active)}
                      <span className="bg-muted/50 px-2 py-0.5 rounded-full text-xs font-medium text-muted-foreground border border-border/50 hidden sm:inline-flex">
                        <FileText className="size-3 mr-1" />
                        {boletin.audio_count} audio
                        {boletin.audio_count !== 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="hidden sm:flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 sm:size-8 rounded-lg hover:bg-primary/10 hover:text-primary text-muted-foreground transition-all"
                        title="Editar"
                        onClick={() => handleEditClick(boletin)}
                        disabled={isLoadingAudios}
                      >
                        {isLoadingAudios ? (
                          <div className="size-3.5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        ) : (
                          <Edit className="size-3.5 sm:size-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 sm:size-8 rounded-lg hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-all"
                        title="Eliminar"
                        onClick={() =>
                          handleDeleteClick(
                            boletin.id,
                            `Boletín ${formatDate(boletin.start_time)}`,
                          )
                        }
                      >
                        <Trash2 className="size-3.5 sm:size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 sm:size-8 rounded-lg hover:bg-primary/10 hover:text-primary text-muted-foreground transition-all"
                        title="Ver detalles"
                        onClick={() => handleVerClick(boletin)}
                        disabled={isLoadingDetail}
                      >
                        {isLoadingDetail ? (
                          <div className="size-3.5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        ) : (
                          <ChevronRight className="size-3.5 sm:size-4" />
                        )}
                      </Button>
                    </div>

                    <div className="sm:hidden">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 rounded-lg hover:bg-primary/10 hover:text-primary text-muted-foreground"
                          >
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem
                            onClick={() => handleEditClick(boletin)}
                            className="flex items-center gap-2 cursor-pointer"
                            disabled={isLoadingAudios}
                          >
                            {isLoadingAudios ? (
                              <div className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            ) : (
                              <Edit className="size-4" />
                            )}
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleDeleteClick(
                                boletin.id,
                                `Boletín ${formatDate(boletin.start_time)}`,
                              )
                            }
                            className="flex items-center gap-2 cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="size-4" />
                            Eliminar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleVerClick(boletin)}
                            className="flex items-center gap-2 cursor-pointer"
                            disabled={isLoadingDetail}
                          >
                            {isLoadingDetail ? (
                              <div className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            ) : (
                              <ChevronRight className="size-4" />
                            )}
                            Ver detalles
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div className="mt-2 sm:mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                      <Calendar className="size-3 sm:size-3.5 shrink-0" />
                      <span>{formatDate(boletin.start_time)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm">
                      <Clock className="size-3 sm:size-3.5 shrink-0 text-primary" />
                      <span className="font-semibold text-primary">
                        {formatTime(boletin.start_time)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground sm:col-span-2">
                      <User className="size-3 sm:size-3.5 shrink-0" />
                      <span className="truncate">
                        {boletin.created_by || "Usuario"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 sm:hidden">
                    <span className="inline-flex items-center gap-1 bg-muted/50 px-2.5 py-0.5 rounded-full text-xs font-medium text-muted-foreground border border-border/50">
                      <FileText className="size-3" />
                      {boletin.audio_count} audio
                      {boletin.audio_count !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={total}
              itemLabel="boletín"
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      {editingBoletin && (
        <EditarBoletinesModal
          key={`edit-${editingBoletin.id}`}
          open={editModalOpen}
          onOpenChange={(open: boolean) => {
            if (!open) {
              setEditingBoletin(null);
            }
            setEditModalOpen(open);
          }}
          selectedBoletines={editingBoletin.audios}
          currentStartTime={editingBoletin.start_time}
          boletinId={editingBoletin.id}
          onConfirm={handleEditConfirm}
        />
      )}

      {boletinDetail && (
        <VerBoletinModal
          open={verModalOpen}
          onOpenChange={(open: boolean) => {
            if (!open) {
              setBoletinDetail(null);
            }
            setVerModalOpen(open);
          }}
          boletin={boletinDetail}
        />
      )}

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Eliminar boletín"
        description={`¿Estás seguro de que quieres eliminar "${boletinToDelete?.name}"?`}
        confirmText="Eliminar"
        destructive={true}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
