"use client";

import {
  Play,
  Pause,
  Download,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { WaveformWithProgress } from "./Waveform";

export interface AudioItem {
  id: string;
  code: string;
  voice: string;
  voiceName: string;
  text: string;
  duration: string;
  timeAgo: string;
  audio_url?: string;
  waveform_url?: string;
}

interface AudioCardProps {
  audio: AudioItem;
  onDelete: (audio: AudioItem) => void;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const parseDuration = (durationStr: string): number => {
  const parts = durationStr.split(":");
  if (parts.length === 2) {
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  }
  return 0;
};

export function AudioCard({ audio, onDelete }: AudioCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isTextExpanded, setIsTextExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const listenersAttachedRef = useRef(false);
  const durationSeconds = parseDuration(audio.duration);

  const updateTime = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      animationRef.current = requestAnimationFrame(updateTime);
    }
  };

  const handlePlayPause = () => {
    if (!audio.audio_url) return;

    if (!audioRef.current) {
      const audioElement = new Audio(audio.audio_url);
      audioRef.current = audioElement;
    }

    const audioElement = audioRef.current;

    if (isPlaying) {
      audioElement?.pause();
      setIsPlaying(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    } else {
      if (!listenersAttachedRef.current) {
        listenersAttachedRef.current = true;
        audioElement?.addEventListener("ended", () => {
          setIsPlaying(false);
          setCurrentTime(0);
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
          }
        });
        audioElement?.addEventListener("error", () => {
          console.error("Error loading audio");
          setIsPlaying(false);
          setCurrentTime(0);
        });
      }
      audioElement?.play().catch((err) => {
        console.error("Error playing audio:", err);
        setIsPlaying(false);
      });
      setIsPlaying(true);
      animationRef.current = requestAnimationFrame(updateTime);
    }
  };

  const handleDownload = async () => {
    if (!audio.audio_url) return;

    try {
      const response = await fetch(audio.audio_url);

      if (!response.ok) {
        throw new Error(`Error al descargar: ${response.status}`);
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${audio.code}.wav`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error al descargar audio:", error);
      window.open(audio.audio_url, "_blank");
    }
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      listenersAttachedRef.current = false;
    };
  }, []);

  return (
    <div className="group rounded-xl border border-border bg-card p-3 transition-all hover:border-primary/30 hover:shadow-md sm:p-4">
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-mono text-primary">
              #{audio.code}
            </span>
            <span className="text-xs text-muted-foreground">
              Voz:{" "}
              <span className="font-semibold text-foreground">
                {audio.voiceName}
              </span>
            </span>
          </div>
          <span className="text-xs text-muted-foreground">{audio.timeAgo}</span>
        </div>

        {/* Texto con toggle y respeto de saltos de línea */}
        <div>
          <p
            className={`text-sm text-foreground whitespace-pre-wrap break-words ${
              !isTextExpanded ? "line-clamp-2" : ""
            }`}
          >
            {audio.text}
          </p>

          {audio.text.length > 80 && (
            <button
              onClick={() => setIsTextExpanded(!isTextExpanded)}
              className="mt-1 flex items-center gap-1 text-xs text-primary hover:underline transition-colors"
            >
              {isTextExpanded ? (
                <>
                  <ChevronUp className="size-3" />
                  Ver menos
                </>
              ) : (
                <>
                  <ChevronDown className="size-3" />
                  Ver más
                </>
              )}
            </button>
          )}
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePlayPause}
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105"
            >
              {isPlaying ? (
                <Pause className="size-4 fill-primary-foreground" />
              ) : (
                <Play className="size-4 fill-primary-foreground" />
              )}
            </button>

            <span className="text-xs font-mono text-muted-foreground">
              {formatTime(currentTime)} / {audio.duration}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleDownload}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Download className="size-4" />
            </button>
            <button
              onClick={() => onDelete(audio)}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>

        {audio.waveform_url && (
          <div className="hidden sm:block">
            <WaveformWithProgress
              waveformUrl={audio.waveform_url}
              currentTime={currentTime}
              duration={durationSeconds}
            />
          </div>
        )}
      </div>
    </div>
  );
}
