// components/features/audios/AudiosClient.tsx
"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AudioCard } from "@/components/features/audios/AudioCard";
import { CreateAudioDialog } from "@/components/features/audios/CreateAudioDialog";
import { AudioFromAPI } from "@/types/audio";
import { convertToAudioItem } from "@/lib/audio-utils";
import { toast } from "sonner";
import { deleteAudio } from "@/app/actions/audio.actions";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface AudiosClientProps {
  initialData: {
    ok: boolean;
    message?: string;
    data: {
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
  const [audios, setAudios] = useState(initialData.data?.items || []);
  const [isPending, startTransition] = useTransition();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [audioToDelete, setAudioToDelete] = useState<{
    id: number;
    text: string;
  } | null>(null);

  const { total, pages: totalPages, size: pageSize } = initialData.data;

  const refreshAudios = useCallback(() => {
    router.refresh();
  }, [router]);

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

        if (audios.length === 1 && currentPage > 1) {
          router.push(`/user/audios?page=${currentPage - 1}&size=${pageSize}`);
        } else {
          router.refresh();
        }
      } else {
        toast.error(result.error || "Error al eliminar el audio");
      }

      setDeleteDialogOpen(false);
      setAudioToDelete(null);
    });
  }, [audioToDelete, audios.length, currentPage, pageSize, router]);

  const filteredAudios =
    searchQuery.trim() === ""
      ? audios
      : audios.filter((audio) =>
          audio.text.toLowerCase().includes(searchQuery.toLowerCase()),
        );

  const handlePageChange = (page: number) => {
    router.push(`/user/audios?page=${page}&size=${pageSize}`);
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

  if (total === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No tienes audios aún</p>
          <CreateAudioDialog onSuccess={refreshAudios} />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-full flex-col">
        {/* Header simplificado */}
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

            <CreateAudioDialog onSuccess={refreshAudios} />
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
                  audio={convertToAudioItem(audio)}
                  onDelete={() => handleDeleteClick(audio.id, audio.text)}
                />
              ))
            )}
          </div>
        </div>

        {/* Paginación simple y moderna */}
        {totalPages > 1 && (
          <div className="border-t border-border p-4">
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="size-4" />
              </Button>

              <span className="text-sm px-3">
                {currentPage} / {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
            <div className="text-center text-xs text-muted-foreground mt-2">
              {total} audio{total !== 1 ? "s" : ""}
            </div>
          </div>
        )}
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
