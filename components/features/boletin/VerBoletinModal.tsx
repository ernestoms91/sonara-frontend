// components/features/boletin/VerBoletinModal.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, FileText, Volume2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AudioFromAPI } from "@/types/api";

interface BoletinDetail {
  id: number;
  start_time: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  active: boolean;
  audio_count: number;
  audio_ids: string[];
  audios: AudioFromAPI[];
}

interface VerBoletinModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  boletin: BoletinDetail | null;
}

export function VerBoletinModal({
  open,
  onOpenChange,
  boletin,
}: VerBoletinModalProps) {
  if (!boletin) return null;

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

  const formatFullDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "PPP 'a las' hh:mm a", { locale: es });
    } catch {
      return dateStr;
    }
  };

  const getStatusBadge = (active: boolean) => {
    return active ? (
      <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
        Activo
      </Badge>
    ) : (
      <Badge variant="secondary" className="text-muted-foreground">
        Inactivo
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col sm:max-w-[95vw]">
        <DialogHeader>
          <div className="flex items-center justify-between pr-6">
            <DialogTitle className="text-xl flex items-center gap-2">
              <FileText className="size-5 text-primary" />
              Boletín #{boletin.id}
            </DialogTitle>
            {getStatusBadge(boletin.active)}
          </div>
          <DialogDescription>Detalles completos del boletín</DialogDescription>
        </DialogHeader>

        {/* Información del boletín */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg border">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="size-4 text-muted-foreground" />
            <span className="text-muted-foreground">Fecha:</span>
            <span className="font-medium">
              {formatDate(boletin.start_time)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="size-4 text-muted-foreground" />
            <span className="text-muted-foreground">Hora:</span>
            <span className="font-medium text-primary">
              {formatTime(boletin.start_time)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <User className="size-4 text-muted-foreground" />
            <span className="text-muted-foreground">Creado por:</span>
            <span className="font-medium">
              {boletin.created_by || "Usuario"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <FileText className="size-4 text-muted-foreground" />
            <span className="text-muted-foreground">Contenido:</span>
            <span className="font-medium">
              {boletin.audio_count} informaciones
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm sm:col-span-2">
            <span className="text-muted-foreground">Creado:</span>
            <span className="text-xs text-muted-foreground">
              {formatFullDate(boletin.created_at)}
            </span>
          </div>
          {boletin.updated_at && (
            <div className="flex items-center gap-2 text-sm sm:col-span-2">
              <span className="text-muted-foreground">
                Última actualización:
              </span>
              <span className="text-xs text-muted-foreground">
                {formatFullDate(boletin.updated_at)}
              </span>
            </div>
          )}
        </div>

        {/* Lista de audios */}
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Informaciones ({boletin.audio_count})
            </h3>
            <Badge variant="outline" className="text-xs">
              {boletin.audio_ids.length} audios
            </Badge>
          </div>

          <ScrollArea className="h-100 pr-4">
            <div className="space-y-3">
              {boletin.audios.map((audio, index) => (
                <div
                  key={audio.id}
                  className="p-4 rounded-lg border border-border/50 bg-card/50 hover:border-primary/20 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                          #{index + 1}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {audio.duration?.toFixed(1)}s
                        </Badge>
                        {audio.profile_name && (
                          <Badge variant="secondary" className="text-xs">
                            <Volume2 className="size-3 mr-1" />
                            {audio.profile_name}
                          </Badge>
                        )}
                        {audio.secondary_profile_name && (
                          <Badge variant="secondary" className="text-xs">
                            <Volume2 className="size-3 mr-1" />
                            {audio.secondary_profile_name}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium line-clamp-2">
                        {audio.title || "Sin título"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {audio.text || "Sin texto"}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span>Caracteres: {audio.character_count || 0}</span>
                        {audio.waveform && (
                          <span>Waveform: {audio.waveform}</span>
                        )}
                        {audio.audio_url && (
                          <a
                            href={audio.audio_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            Escuchar
                          </a>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6 shrink-0 hover:bg-muted"
                      onClick={() => {
                        if (audio.audio_url) {
                          window.open(audio.audio_url, "_blank");
                        }
                      }}
                      title="Escuchar audio"
                    >
                      <Volume2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
