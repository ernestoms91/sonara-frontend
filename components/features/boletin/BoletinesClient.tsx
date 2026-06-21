// components/features/boletines/BoletinesClient.tsx
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
import { AudioFromAPI } from "@/types/audio";
import { getAudios } from "@/app/actions/audio.actions";
import { OrdenarBoletinesModal } from "./OrdenarBoletinesModal";
import { AudioBoletinCard } from "./AudioBoletinCard";
import { createCompoundBoletin } from "@/app/actions/boletin.actions";

interface BoletinesClientProps {
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

export function BoletinesClient({
  initialData,
  currentPage,
}: BoletinesClientProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [boletines, setBoletines] = useState(initialData.data?.items || []);
  const [currentPageState, setCurrentPageState] = useState(currentPage);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(currentPage < initialData.data.pages);
  const [selectedBoletines, setSelectedBoletines] = useState<Set<number>>(
    new Set(),
  );
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

      if (result.error) {
        toast.error("Error al cargar más boletines");
        setHasMore(false);
        return;
      }

      const items = result.data?.data?.items;
      const pages = result.data?.data?.pages;

      if (!items?.length) {
        toast.info("No hay más boletines para cargar");
        setHasMore(false);
        return;
      }

      setBoletines((prev) => [...prev, ...items]);
      setCurrentPageState(nextPage);
      setHasMore(nextPage < (pages ?? 0));
      toast.success(`Cargando ${items.length} informaciones más`);
    } catch (error) {
      console.error("Error loading more:", error);
      toast.error("Error al cargar más boletines");
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

  const toggleSelection = (boletinId: number) => {
    setSelectedBoletines((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(boletinId)) {
        newSet.delete(boletinId);
      } else {
        newSet.add(boletinId);
      }
      console.log("Seleccionados:", newSet.size); // Debug
      return newSet;
    });
  };

  const selectAll = () => {
    const currentPageIds = filteredBoletines.map((b) => b.id);
    setSelectedBoletines((prev) => {
      const newSet = new Set(prev);
      currentPageIds.forEach((id) => newSet.add(id));
      return newSet;
    });
  };

  const deselectAll = () => {
    const currentPageIds = filteredBoletines.map((b) => b.id);
    setSelectedBoletines((prev) => {
      const newSet = new Set(prev);
      currentPageIds.forEach((id) => newSet.delete(id));
      return newSet;
    });
  };

  // En BoletinesClient.tsx, modifica handleCreateClick:
  const handleCreateClick = () => {
    if (selectedBoletines.size === 0) {
      toast.error("Selecciona al menos un audio para crear el boletín");
      return;
    }

    if (selectedBoletines.size > 30) {
      toast.error("Máximo 30 audios por boletín");
      return;
    }

    // Obtener los items seleccionados
    const items = boletines.filter((b) => selectedBoletines.has(b.id));
    console.log("Items filtrados:", items.length);
    console.log(
      "Items:",
      items.map((i) => ({ id: i.id, title: i.title })),
    );

    setSelectedItems(items);
    setShowOrderModal(true);
  };

  // En BoletinesClient.tsx, actualiza handleConfirmOrder:
  const handleConfirmOrder = async (
    orderedIds: string[],
    startTime: string,
  ) => {
    const result = await createCompoundBoletin(orderedIds, startTime); // ← Pasar startTime

    if (result.success) {
      toast.success(`Boletín creado con ${orderedIds.length} audios`);
      setSelectedBoletines(new Set());
      setShowOrderModal(false);
      setTimeout(() => {
        window.location.href =
          "/user/boletin/listar?page=1&size=10&active_only=true";
      }, 900);
    } else {
      toast.error(result.error);
    }
  };

  const filteredBoletines =
    searchQuery.trim() === ""
      ? boletines
      : boletines.filter(
          (boletin) =>
            boletin.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            boletin.text.toLowerCase().includes(searchQuery.toLowerCase()),
        );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const isAllSelected =
    filteredBoletines.length > 0 &&
    filteredBoletines.every((b) => selectedBoletines.has(b.id));

  if (boletines.length === 0 && !initialData.data?.items?.length) {
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
        <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md px-3 py-2 sm:px-4 sm:py-3 md:px-6 lg:px-8">
          <div className="flex flex-col gap-2 sm:gap-3">
            <div className="flex items-center justify-between gap-2">
              <h1 className="text-lg font-bold sm:text-xl md:text-2xl">
                Crear Boletin
              </h1>

              <div className="relative flex-1 max-w-sm hidden sm:block">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar boletines..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="pl-9"
                />
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="sm:hidden"
                onClick={() => setShowMobileSearch(!showMobileSearch)}
              >
                <Search className="size-4" />
              </Button>
            </div>

            {showMobileSearch && (
              <div className="relative w-full sm:hidden">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar boletines..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="pl-9"
                  autoFocus
                />
              </div>
            )}

            {filteredBoletines.length > 0 && (
              <div className="flex items-center justify-between gap-2 py-2 border-t pt-2 sm:pt-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={(checked) => {
                      if (checked) selectAll();
                      else deselectAll();
                    }}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    {selectedBoletines.size} seleccionado
                    {selectedBoletines.size !== 1 ? "s" : ""}
                  </span>
                  {selectedBoletines.size > 0 && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-primary/10 text-primary"
                    >
                      Máx 30
                    </Badge>
                  )}
                </div>

                <Button
                  size="sm"
                  onClick={handleCreateClick}
                  disabled={selectedBoletines.size !== 30} // ← Solo depende de la selección
                  className="gap-1 sm:gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm"
                >
                  <ArrowRight className="size-3 sm:size-4" />
                  <span className="hidden sm:inline">Crear boletín</span>
                  <span className="sm:hidden">
                    ({selectedBoletines.size}/30)
                  </span>
                </Button>
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-2 sm:p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-5xl space-y-3 sm:space-y-4">
            {filteredBoletines.map((boletin) => (
              <AudioBoletinCard
                key={boletin.id}
                boletin={boletin}
                isSelected={selectedBoletines.has(boletin.id)}
                onToggleSelect={toggleSelection}
              />
            ))}

            {hasMore && (
              <div
                ref={loadMoreRef}
                className="flex justify-center py-4 sm:py-8"
              >
                {isLoadingMore ? (
                  <div className="flex items-center gap-2 sm:gap-3 text-muted-foreground">
                    <Loader2 className="size-4 sm:size-5 animate-spin text-primary" />
                    <span className="text-xs sm:text-sm">
                      Cargando más informaciones...
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

            {!hasMore && boletines.length > 0 && (
              <div className="text-center py-4 sm:py-6">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/5 text-xs sm:text-sm text-muted-foreground">
                  <FileText className="size-3 sm:size-4 text-primary" />✓{" "}
                  {boletines.length} de {total} informaciones cargadas
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <OrdenarBoletinesModal
        key={showOrderModal ? "open" : "closed"} // ← Añade esta key
        open={showOrderModal}
        onOpenChange={setShowOrderModal}
        selectedBoletines={selectedItems}
        onConfirm={handleConfirmOrder}
      />
    </>
  );
}
