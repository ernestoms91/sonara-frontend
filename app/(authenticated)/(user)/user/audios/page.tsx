"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/common/Pagination";
import { AudioCard } from "@/components/features/audios/AudioCard";
import { AudioFromAPI, AudioListApiResponse } from "@/types/audio";
import { convertToAudioItem } from "@/lib/audio-utils";
import { toast } from "sonner";
import { deleteAudio } from "@/app/actions/audio.actions";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export default function AudiosPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [audios, setAudios] = useState<AudioFromAPI[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [audioToDelete, setAudioToDelete] = useState<{
    id: number;
    text: string;
  } | null>(null);

  useEffect(() => {
    const fetchAudios = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/audios?page=${currentPage}&size=10`);

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const result: AudioListApiResponse = await response.json();

        if (result.ok && result.data) {
          setAudios(result.data.items);
          setTotalPages(result.data.pages);
        } else {
          throw new Error(result.message || "Error al cargar audios");
        }
      } catch (err) {
        console.error("Error fetching audios:", err);
        setError(err instanceof Error ? err.message : "Error al cargar audios");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAudios();
  }, [currentPage]);

  // Abrir diálogo de confirmación
  const handleDeleteClick = useCallback(
    (audioId: number, audioText: string) => {
      setAudioToDelete({ id: audioId, text: audioText });
      setDeleteDialogOpen(true);
    },
    [],
  );

  // Eliminar después de confirmar
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
  const localTotalPages = Math.ceil(filteredAudios.length / itemsPerPage);
  const paginatedAudios = filteredAudios.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const displayTotalPages = localTotalPages > 1 ? localTotalPages : totalPages;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading && audios.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando audios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-2">Error: {error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-full flex-col">
        <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
          <div className="block px-4 py-3 sm:hidden">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-foreground">Mis Audios</h1>
              <Button
                size="sm"
                className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="size-3.5" />
                Nuevo
              </Button>
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

            <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="size-4" />
              Nuevo<span className="hidden lg:inline"> Audio</span>
            </Button>
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
      </div>

      {/* Diálogo de confirmación */}
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
