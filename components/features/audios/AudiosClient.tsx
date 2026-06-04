// components/features/audios/AudiosClient.tsx
"use client";

import { useState, useTransition, useCallback } from "react";
import { Search } from "lucide-react";
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
}

export function AudiosClient({ initialData }: AudiosClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [audios, setAudios] = useState(initialData.data?.items || []);
  const [isPending, startTransition] = useTransition();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [audioToDelete, setAudioToDelete] = useState<{
    id: number;
    text: string;
  } | null>(null);

  const refreshAudios = useCallback(async () => {
    // Recargar la página para obtener los nuevos audios
    window.location.reload();
  }, []);

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
        setAudios((prev) => prev.filter((a) => a.id !== audioToDelete.id));
      } else {
        toast.error(result.error || "Error al eliminar el audio");
      }

      setDeleteDialogOpen(false);
      setAudioToDelete(null);
    });
  }, [audioToDelete]);

  const filteredAudios = audios.filter((audio) =>
    audio.text.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const itemsPerPage = 5;
  const paginatedAudios = filteredAudios.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const localTotalPages = Math.ceil(filteredAudios.length / itemsPerPage);

  if (audios.length === 0 && !initialData.data?.items?.length) {
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
        <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
          {/* Mobile header */}
          <div className="block px-4 py-3 sm:hidden">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-foreground">Mis Audios</h1>
              <CreateAudioDialog onSuccess={refreshAudios} />
            </div>
            <div className="relative mt-3 w-full">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar audios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Desktop header */}
          <div className="hidden px-4 py-3 sm:flex sm:items-center sm:justify-between md:px-6 lg:px-8">
            <h1 className="text-xl font-bold text-foreground md:text-2xl lg:text-3xl">
              Mis Audios
            </h1>

            <div className="relative w-64 md:w-64 lg:w-96">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar audios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <CreateAudioDialog onSuccess={refreshAudios} />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-5xl space-y-3 md:space-y-4">
            {paginatedAudios.map((audio) => (
              <AudioCard
                key={audio.id}
                audio={convertToAudioItem(audio)}
                onDelete={() => handleDeleteClick(audio.id, audio.text)}
              />
            ))}
          </div>
        </div>

        {localTotalPages > 1 && (
          <div className="border-t border-border p-4">
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <span className="flex items-center px-4 text-sm">
                Página {currentPage} de {localTotalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === localTotalPages}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Eliminar audio"
        description={`¿Estás seguro de que quieres eliminar "${audioToDelete?.text?.substring(0, 50)}..."? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        destructive={true}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
