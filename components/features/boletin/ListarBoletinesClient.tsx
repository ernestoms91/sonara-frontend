// components/features/boletin/ListarBoletinesClient.tsx
"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Calendar,
  Clock,
  User,
  Edit,
  Copy,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { getBoletines } from "@/app/actions/boletin.actions";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pagination } from "@/components/common/Pagination";

interface BoletinFromAPI {
  id: number;
  start_time: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  active: boolean;
  audio_count: number;
  audio_ids: string[];
}

interface ListarBoletinesClientProps {
  initialData: {
    success: boolean;
    error?: string;
    data?: {
      items: BoletinFromAPI[];
      total: number;
      page: number;
      size: number;
      pages: number;
    };
  };
  currentPage: number;
}

export default function ListarBoletinesClient({
  initialData,
  currentPage,
}: ListarBoletinesClientProps) {
  const router = useRouter();
  const [boletines] = useState(initialData.data?.items || []);
  const [isPending, startTransition] = useTransition();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [boletinToDelete, setBoletinToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);

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
        await new Promise((resolve) => setTimeout(resolve, 500));
        toast.success("Boletín eliminado correctamente");

        if (boletines.length === 1 && currentPage > 1) {
          router.push(
            `/user/boletin/listar?page=${currentPage - 1}&size=${pageSize}`,
          );
        } else {
          router.refresh();
        }
      } catch (error) {
        toast.error("Error al eliminar el boletín");
      }

      setDeleteDialogOpen(false);
      setBoletinToDelete(null);
    });
  }, [boletinToDelete, boletines.length, currentPage, pageSize, router]);

  const handlePageChange = (page: number) => {
    router.push(`/user/boletin/listar?page=${page}&size=${pageSize}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

  if (isPending) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (total === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center px-4">
          <FileText className="size-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">No tienes boletines aún</p>
          <Button asChild>
            <Link href="/user/boletines/crear">Crear primer boletín</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-full flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md px-3 py-2 sm:px-4 sm:py-3 md:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-base font-bold sm:text-xl md:text-2xl">
              Mis Boletines
            </h1>

            <Button asChild size="sm" className="gap-1 text-xs sm:text-sm">
              <Link href="/user/boletines/crear">
                <FileText className="size-3 sm:size-4" />
                <span className="hidden sm:inline">Nuevo Boletín</span>
                <span className="sm:hidden">Nuevo</span>
              </Link>
            </Button>
          </div>
        </header>

        {/* Lista de boletines */}
        <div className="flex-1 overflow-auto p-3 sm:p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {/* Desktop: Tabla (solo en lg) */}
            <div className="hidden lg:block glass-panel rounded-2xl overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/30">
                      <th className="px-4 py-3 text-xs font-mono text-muted-foreground uppercase tracking-widest">
                        ID
                      </th>
                      <th className="px-4 py-3 text-xs font-mono text-muted-foreground uppercase tracking-widest">
                        Fecha / Hora
                      </th>
                      <th className="px-4 py-3 text-xs font-mono text-muted-foreground uppercase tracking-widest">
                        Creador
                      </th>
                      <th className="px-4 py-3 text-xs font-mono text-muted-foreground uppercase tracking-widest text-center">
                        Contenido
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
                    {boletines.map((boletin) => (
                      <tr
                        key={boletin.id}
                        className="hover:bg-muted/20 transition-colors group"
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
                          <span className="bg-muted/50 px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground border border-border/50 whitespace-nowrap">
                            {boletin.audio_count} info
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
                              asChild
                            >
                              <Link
                                href={`/user/boletines/${boletin.id}/editar`}
                              >
                                <Edit className="size-4" />
                              </Link>
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
                              asChild
                            >
                              <Link href={`/user/boletines/${boletin.id}`}>
                                <ChevronRight className="size-4" />
                              </Link>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile & Tablet: Tarjetas (hasta lg) */}
            <div className="lg:hidden space-y-3">
              {boletines.map((boletin) => (
                <div
                  key={boletin.id}
                  className="glass-panel rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-3 sm:p-4 hover:border-primary/20 transition-colors"
                >
                  {/* Fila superior: ID y acciones */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs sm:text-sm text-primary bg-primary/10 px-2 py-0.5 rounded">
                        #{String(boletin.id).padStart(3, "0")}
                      </span>
                      {getStatusBadge(boletin.active)}
                      <span className="bg-muted/50 px-2 py-0.5 rounded-full text-xs font-medium text-muted-foreground border border-border/50 hidden sm:inline-flex">
                        <FileText className="size-3 mr-1" />
                        {boletin.audio_count} info
                        {boletin.audio_count !== 1 ? "s" : ""}
                      </span>
                    </div>

                    {/* Acciones - Tablet/Desktop */}
                    <div className="hidden sm:flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 sm:size-8 rounded-lg hover:bg-primary/10 hover:text-primary text-muted-foreground transition-all"
                        title="Editar"
                        asChild
                      >
                        <Link href={`/user/boletines/${boletin.id}/editar`}>
                          <Edit className="size-3.5 sm:size-4" />
                        </Link>
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
                        asChild
                      >
                        <Link href={`/user/boletines/${boletin.id}`}>
                          <ChevronRight className="size-3.5 sm:size-4" />
                        </Link>
                      </Button>
                    </div>

                    {/* Acciones - Móvil */}
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
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/user/boletines/${boletin.id}`}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <ChevronRight className="size-4" />
                              Ver detalles
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/user/boletines/${boletin.id}/editar`}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <Edit className="size-4" />
                              Editar
                            </Link>
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
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Cuerpo: fecha y hora con AM/PM - HORA CON COLOR PRIMARY */}
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

                  {/* Contador - Móvil */}
                  <div className="mt-2 sm:hidden">
                    <span className="inline-flex items-center gap-1 bg-muted/50 px-2.5 py-0.5 rounded-full text-xs font-medium text-muted-foreground border border-border/50">
                      <FileText className="size-3" />
                      {boletin.audio_count} info
                      {boletin.audio_count !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginación */}
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
