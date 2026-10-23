// components/features/audios/AudiosClient.tsx
"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AudioLines, Search } from "lucide-react";
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

  // Calcular totalPages dinámicamente
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
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-[3px] border-primary border-t-transparent" />
      </div>
    );
  }

  const isEmpty = totalItems === 0;

  return (
    <>
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-16 z-20 border-b border-border/70 bg-background/80 backdrop-blur-xl md:top-0">
          <div className="mx-auto w-full max-w-5xl px-4 py-3 md:px-6 lg:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  Biblioteca
                </p>
                <h1 className="mt-0.5 text-xl font-semibold text-foreground md:text-2xl">
                  Mis audios
                </h1>
              </div>

              <div className="flex w-full items-center gap-2 sm:w-auto">
                <div className="relative flex-1 sm:w-64 lg:w-72">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por texto…"
                    value={searchQuery}
                    onChange={handleSearch}
                    className="h-9 bg-card pl-9"
                  />
                </div>
                <CreateAudioDialog onSuccess={handleAudioCreated} />
              </div>
            </div>
          </div>
        </header>

        {/* Lista de audios */}
        <div className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-5xl">
            {isEmpty ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
                <div className="flex size-12 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
                  <AudioLines className="size-6 text-primary" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-foreground">
                  Aún no tienes audios
                </h2>
                <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
                  Genera tu primera locución con una de las voces disponibles y
                  aparecerá aquí.
                </p>
                <div className="mt-6">
                  <CreateAudioDialog onSuccess={handleAudioCreated} />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAudios.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border bg-card/60 px-6 py-14 text-center">
                    <p className="text-sm text-muted-foreground">
                      No se encontraron audios para “{searchQuery}”.
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
            )}

            {/* Paginación */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemLabel="audio"
              onPageChange={handlePageChange}
            />
          </div>
        </div>
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
