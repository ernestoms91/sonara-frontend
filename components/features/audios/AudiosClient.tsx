// components/features/audios/AudiosClient.tsx
"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AudioCard } from "@/components/features/audios/AudioCard";
import { CreateAudioDialog } from "@/components/features/audios/CreateAudioDialog";
import { toast } from "sonner";
import { deleteAudio } from "@/app/actions/audio.actions";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Pagination } from "@/components/common/Pagination";
import { AudioFromAPI } from "@/types/api";

interface AudiosClientProps {
  initialData: {
    success: boolean;
    error?: string;
    data?: {
      items: AudioFromAPI[];
      total: number;
      page: number;
      size: number;
      pages: number;
    };
  };
  currentPage: number;
}

export function AudiosClient({ initialData, currentPage }: AudiosClientProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Estados locales para optimistic updates
  const [audios, setAudios] = useState(initialData.data?.items || []);
  const [totalItems, setTotalItems] = useState(initialData.data?.total || 0);
  const pageSize = initialData.data?.size || 10;

  // ✅ Calcular totalPages dinámicamente
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const [isPending, startTransition] = useTransition();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [audioToDelete, setAudioToDelete] = useState<{
    id: number;
    text: string;
  } | null>(null);

  // Función para agregar audio nuevo al estado local (optimistic update)
  const handleAudioCreated = useCallback(
    (newAudio: AudioFromAPI) => {
      setAudios((prev) => {
        // Agregar al principio y mantener el tamaño de página
        const newList = [newAudio, ...prev];
        if (newList.length > pageSize) {
          return newList.slice(0, pageSize);
        }
        return newList;
      });
      setTotalItems((prev) => prev + 1);
    },
    [pageSize],
  );

  const handleDeleteClick = useCallback(
    (audioId: number, audioText: string) => {
      setAudioToDelete({ id: audioId, text: audioText });
      setDeleteDialogOpen(true);
    },
    [],
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!audioToDelete) return;

    startTransition(async () => {
      const result = await deleteAudio(audioToDelete.id);

      if (result.success) {
        toast.success("Audio eliminado correctamente");

        // ✅ Actualizar estado local
        const newAudios = audios.filter(
          (audio) => audio.id !== audioToDelete.id,
        );
        const newTotal = totalItems - 1;

        setAudios(newAudios);
        setTotalItems(newTotal);

        // ✅ Si la página queda con menos de pageSize elementos y hay más en total
        if (newAudios.length < pageSize && newTotal >= pageSize) {
          // La key en page.tsx forzará el remontaje con los datos correctos
          router.push(`/user/audios?page=${currentPage}&size=${pageSize}`);
        }

        // Si no quedan audios en la página actual y no estamos en la primera
        if (newAudios.length === 0 && currentPage > 1) {
          router.push(`/user/audios?page=${currentPage - 1}&size=${pageSize}`);
        }
      } else {
        toast.error(result.error || "Error al eliminar el audio");
      }

      setDeleteDialogOpen(false);
      setAudioToDelete(null);
    });
  }, [audioToDelete, audios, totalItems, currentPage, pageSize, router]);

  const filteredAudios =
    searchQuery.trim() === ""
      ? audios
      : audios.filter((audio) =>
          audio.text.toLowerCase().includes(searchQuery.toLowerCase()),
        );

  const handlePageChange = (page: number) => {
    router.push(`/user/audios?page=${page}&size=${pageSize}`);
    // ✅ No necesitamos router.refresh() aquí, la key en page.tsx forzará el remontaje
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (isPending) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (totalItems === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No tienes audios aún</p>
          <CreateAudioDialog onSuccess={handleAudioCreated} />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-full flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md px-4 py-3 md:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-xl font-bold md:text-2xl">Mis Audios</h1>

            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar audios..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-9"
              />
            </div>

            <CreateAudioDialog onSuccess={handleAudioCreated} />
          </div>
        </header>

        {/* Lista de audios */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-5xl space-y-3">
            {filteredAudios.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {searchQuery
                    ? "No se encontraron resultados"
                    : "No hay audios"}
                </p>
              </div>
            ) : (
              filteredAudios.map((audio) => (
                <AudioCard
                  key={audio.id}
                  audio={audio}
                  onDelete={() => handleDeleteClick(audio.id, audio.text)}
                />
              ))
            )}
          </div>
        </div>

        {/* Paginación */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemLabel="audio"
          onPageChange={handlePageChange}
        />
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Eliminar audio"
        description={`¿Estás seguro de que quieres eliminar "${audioToDelete?.text?.substring(0, 50)}..."?`}
        confirmText="Eliminar"
        destructive={true}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
