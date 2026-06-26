// components/features/boletin/AudioBoletinCard.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  User,
  Clock,
  Calendar,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { AudioFromAPI } from "@/types/api";

// Formatear duración
const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

// Formatear fecha
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

// Componente de audio
function AudioPlayer({ url, title }: { url: string; title: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const audio = new Audio(url);
    audioRef.current = audio;

    const handleEnded = () => setIsPlaying(false);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);

    return () => {
      audio.pause();
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDurationChange);
    };
  }, [url]);

  return (
    <div className="flex items-center gap-3 w-full">
      <Button
        size="icon"
        variant="outline"
        className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 rounded-full"
        onClick={togglePlay}
      >
        {isPlaying ? (
          <Pause className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        ) : (
          <Play className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-0.5" />
        )}
      </Button>

      <div className="flex-1 flex flex-col justify-center">
        <div className="h-1.5 sm:h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-200"
            style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] sm:text-xs text-muted-foreground mt-1">
          <span>{formatDuration(currentTime)}</span>
          <span>{formatDuration(duration)}</span>
        </div>
      </div>
    </div>
  );
}

// Formatear texto
function formatBoletinText(text: string, isExpanded: boolean): React.ReactNode {
  if (!isExpanded) {
    const truncated = text.length > 150 ? text.substring(0, 150) + "..." : text;
    return (
      <p className="text-xs sm:text-sm text-muted-foreground whitespace-pre-wrap wrap-break-word">
        {truncated}
      </p>
    );
  }

  let cleanText = text.replace(/\[Dueto:.*?\]\s*/g, "");
  cleanText = cleanText.replace(/\[P(\d+)\]/g, "\n\n$1. ");
  const paragraphs = cleanText.split(/\n\n+/);

  return (
    <div className="space-y-2 sm:space-y-3">
      {paragraphs.map((paragraph, idx) => {
        if (paragraph.trim()) {
          return (
            <p
              key={idx}
              className="text-xs sm:text-sm text-muted-foreground whitespace-pre-wrap wrap-break-word leading-relaxed"
            >
              {paragraph.trim()}
            </p>
          );
        }
        return null;
      })}
    </div>
  );
}

interface AudioBoletinCardProps {
  audio: AudioFromAPI;
  isSelected: boolean;
  onToggleSelect: (id: number) => void;
}

export function AudioBoletinCard({
  audio,
  isSelected,
  onToggleSelect,
}: AudioBoletinCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = audio.text.length > 150;

  return (
    <Card
      className={`group hover:shadow-lg transition-all duration-300 overflow-hidden ${
        isSelected
          ? "border-primary ring-2 ring-primary/20 shadow-md"
          : "hover:border-primary/30"
      }`}
    >
      <div className="h-1 bg-linear-to-r from-primary/80 via-primary to-primary/80" />

      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 px-3 pt-3 sm:pt-4 sm:px-4">
        <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggleSelect(audio.id)}
            className="mt-1 shrink-0 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm sm:text-base md:text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {audio.title || "Sin título"}
            </CardTitle>
            <div className="flex flex-wrap gap-1 mt-1.5 sm:mt-2">
              <Badge
                variant="secondary"
                className="text-[10px] sm:text-xs bg-primary/10 text-primary hover:bg-primary/20 px-1.5 py-0 sm:px-2"
              >
                <User className="size-2.5 sm:size-3 mr-0.5 sm:mr-1" />
                <span className="truncate max-w-20 sm:max-w-none">
                  {audio.profile_name || "Desconocida"}
                </span>
              </Badge>
              {audio.secondary_profile_name && (
                <Badge
                  variant="secondary"
                  className="text-[10px] sm:text-xs bg-primary/10 text-primary hover:bg-primary/20 px-1.5 py-0 sm:px-2"
                >
                  <User className="size-2.5 sm:size-3 mr-0.5 sm:mr-1" />
                  <span className="truncate max-w-20 sm:max-w-none">
                    {audio.secondary_profile_name}
                  </span>
                </Badge>
              )}
              <Badge
                variant="outline"
                className="text-[10px] sm:text-xs border-primary/30 text-foreground/70 px-1.5 py-0 sm:px-2"
              >
                <Clock className="size-2.5 sm:size-3 mr-0.5 sm:mr-1" />
                <span className="whitespace-nowrap">
                  {formatDuration(audio.duration)}
                </span>
              </Badge>
              <Badge
                variant="outline"
                className="text-[10px] sm:text-xs border-primary/30 text-foreground/70 px-1.5 py-0 sm:px-2 hidden sm:flex"
              >
                <Calendar className="size-3 mr-1" />
                {formatDate(audio.created_at)}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-3 pb-3 sm:px-4 sm:pb-4">
        {/* Texto */}
        <div className="mb-3 sm:mb-4">
          {formatBoletinText(audio.text, isExpanded)}

          {shouldTruncate && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 mt-1.5 sm:mt-2 font-medium"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="size-3" />
                  <span>Ver menos</span>
                </>
              ) : (
                <>
                  <ChevronDown className="size-3" />
                  <span>Ver más</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Fecha móvil + Reproductor */}
        <div className="pt-2 border-t border-border/50">
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground sm:hidden mb-2">
            <Calendar className="size-2.5" />
            <span>{formatDate(audio.created_at)}</span>
          </div>

          <AudioPlayer
            url={audio.audio_url || ""}
            title={audio.title || "Audio"}
          />
        </div>
      </CardContent>
    </Card>
  );
}
