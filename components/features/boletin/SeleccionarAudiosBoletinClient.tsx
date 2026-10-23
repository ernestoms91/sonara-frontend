// components/features/boletin/SeleccionarAudiosBoletinClient.tsx
"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, FileText, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import Link from "next/link";
import { getAudios } from "@/app/actions/audio.actions";
import { OrdenarBoletinesModal } from "./OrdenarBoletinesModal";
import { createCompoundBoletin } from "@/app/actions/boletin.actions";
import { AudioFromAPI } from "@/types/api";
import { AudioCard } from "../audios/AudioCard";
import { AudioBoletinCard } from "./AudioBoletinCard";

interface SeleccionarAudiosBoletinClientProps {
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

export function SeleccionarAudiosBoletinClient({
  initialData,
  currentPage,
}: SeleccionarAudiosBoletinClientProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [audios, setAudios] = useState(initialData.data?.items || []);
  const [currentPageState, setCurrentPageState] = useState(currentPage);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(currentPage < initialData.data.pages);
  const [selectedAudios, setSelectedAudios] = useState<Set<number>>(new Set());
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState<AudioFromAPI[]>([]);

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { total } = initialData.data;

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    const nextPage = currentPageState + 1;

    try {
      const result = await getAudios(nextPage, 30);

      if (!result.success || !result.data) {
        toast.error("Error al cargar más audios");
        setHasMore(false);
        return;
      }

      const items = result.data.items;
      const pages = result.data.pages;

      if (!items?.length) {
        toast.info("No hay más audios para cargar");
        setHasMore(false);
        return;
      }

      setAudios((prev) => [...prev, ...items]);
      setCurrentPageState(nextPage);
      setHasMore(nextPage < (pages ?? 0));
      toast.success(`Cargando ${items.length} audios más`);
    } catch (error) {
      console.error("Error loading more:", error);
      toast.error("Error al cargar más audios");
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, currentPageState]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: "100px" },
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore, isLoadingMore, loadMore]);

  const toggleSelection = (audioId: number) => {
    setSelectedAudios((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(audioId)) {
        newSet.delete(audioId);
      } else {
        newSet.add(audioId);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    const currentPageIds = filteredAudios.map((a) => a.id);
    setSelectedAudios((prev) => {
      const newSet = new Set(prev);
      currentPageIds.forEach((id) => newSet.add(id));
      return newSet;
    });
  };

  const deselectAll = () => {
    const currentPageIds = filteredAudios.map((a) => a.id);
    setSelectedAudios((prev) => {
      const newSet = new Set(prev);
      currentPageIds.forEach((id) => newSet.delete(id));
      return newSet;
    });
  };

  const handleCreateClick = () => {
    if (selectedAudios.size === 0) {
      toast.error("Selecciona al menos un audio para crear el boletín");
      return;
    }

    if (selectedAudios.size > 30) {
      toast.error("Máximo 30 audios por boletín");
      return;
    }

    const items = audios.filter((a) => selectedAudios.has(a.id));
    setSelectedItems(items);
    setShowOrderModal(true);
  };

  const handleConfirmOrder = async (
    orderedIds: string[],
    startTime: string,
  ) => {
    const result = await createCompoundBoletin(orderedIds, startTime);

    if (result.success) {
      toast.success(`Boletín creado con ${orderedIds.length} audios`);
      setSelectedAudios(new Set());
      setShowOrderModal(false);

      // Navegar y refrescar
      router.push("/user/boletin/listar?page=1&size=10&active_only=true");
    } else {
      toast.error(result.error);
    }
  };

  const filteredAudios =
    searchQuery.trim() === ""
      ? audios
      : audios.filter(
          (audio) =>
            audio.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            audio.text.toLowerCase().includes(searchQuery.toLowerCase()),
        );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const isAllSelected =
    filteredAudios.length > 0 &&
    filteredAudios.every((a) => selectedAudios.has(a.id));

  return (
    <>
      <div className="flex flex-1 flex-col">
        <header className="sticky top-16 z-20 border-b border-border/70 bg-background/80 backdrop-blur-xl md:top-0">
          <div className="px-4 py-3 md:px-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 sm:gap-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                    Producción
                  </p>
                  <h1 className="mt-0.5 text-lg font-semibold sm:text-xl md:text-2xl">
                    Crear boletín
                  </h1>
                </div>

                <div className="relative hidden max-w-sm flex-1 sm:block">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar audios…"
                    value={searchQuery}
                    onChange={handleSearch}
                    className="h-9 bg-card pl-9"
                  />
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  className="size-9 sm:hidden"
                  onClick={() => setShowMobileSearch(!showMobileSearch)}
                  aria-label="Buscar audios"
                >
                  <Search className="size-4" />
                </Button>
              </div>

              {showMobileSearch && (
                <div className="relative w-full sm:hidden">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar audios…"
                    value={searchQuery}
                    onChange={handleSearch}
                    className="h-9 bg-card pl-9"
                    autoFocus
                  />
                </div>
              )}

              {filteredAudios.length > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/70 bg-card/60 px-3 py-2">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={(checked) => {
                        if (checked) selectAll();
                        else deselectAll();
                      }}
                      className="data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                    />
                    <span className="text-xs text-muted-foreground sm:text-sm">
                      {selectedAudios.size} seleccionado
                      {selectedAudios.size !== 1 ? "s" : ""}
                    </span>
                    {selectedAudios.size > 0 && (
                      <Badge
                        variant="secondary"
                        className="border border-primary/15 bg-primary/10 text-xs text-primary"
                      >
                        Máx. 30
                      </Badge>
                    )}
                  </div>

                  <Button
                    size="sm"
                    onClick={handleCreateClick}
                    disabled={selectedAudios.size === 0}
                    className="h-8 gap-1.5 px-3 text-xs sm:text-sm"
                  >
                    <ArrowRight className="size-3.5 sm:size-4" />
                    <span className="hidden sm:inline">Crear boletín</span>
                    <span className="sm:hidden">({selectedAudios.size}/30)</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 px-4 py-4 md:px-6 md:py-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-5xl space-y-3 sm:space-y-4">
            {filteredAudios.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
                <div className="flex size-12 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
                  <FileText className="size-6 text-primary" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-foreground">
                  {searchQuery
                    ? "No se encontraron audios"
                    : "Aún no tienes audios"}
                </h2>
                <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
                  {searchQuery
                    ? `No hay resultados para “${searchQuery}”.`
                    : "Genera audios primero para poder armar un boletín."}
                </p>
                <Button asChild variant="outline" size="sm" className="mt-6 h-9">
                  <Link href="/user/audios">Ir a mis audios</Link>
                </Button>
              </div>
            ) : (
              filteredAudios.map((audio) => (
                <AudioBoletinCard
                  key={audio.id}
                  audio={audio}
                  isSelected={selectedAudios.has(audio.id)}
                  onToggleSelect={toggleSelection}
                />
              ))
            )}

            {hasMore && (
              <div
                ref={loadMoreRef}
                className="flex justify-center py-4 sm:py-8"
              >
                {isLoadingMore ? (
                  <div className="flex items-center gap-2 sm:gap-3 text-muted-foreground">
                    <Loader2 className="size-4 sm:size-5 animate-spin text-primary" />
                    <span className="text-xs sm:text-sm">
                      Cargando más audios...
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 sm:gap-3 text-muted-foreground">
                    <ArrowRight className="size-4 sm:size-5 text-primary/50" />
                    <span className="text-xs sm:text-sm text-muted-foreground/70">
                      Desplázate para cargar más
                    </span>
                  </div>
                )}
              </div>
            )}

            {!hasMore && audios.length > 0 && (
              <div className="text-center py-4 sm:py-6">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/5 text-xs sm:text-sm text-muted-foreground">
                  <FileText className="size-3 sm:size-4 text-primary" />✓{" "}
                  {audios.length} de {total} audios cargados
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <OrdenarBoletinesModal
        key={showOrderModal ? "open" : "closed"}
        open={showOrderModal}
        onOpenChange={setShowOrderModal}
        selectedBoletines={selectedItems}
        onConfirm={handleConfirmOrder}
      />
    </>
  );
}
