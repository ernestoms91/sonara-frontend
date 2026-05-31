// lib/audio-utils.ts
import { AudioFromAPI, AudioItem } from "@/types/audio";

// Formatear duración (segundos -> "MM:SS")
export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

// Formatear fecha relativa
export const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Hace unos segundos";
  if (diffMins < 60)
    return `Hace ${diffMins} ${diffMins === 1 ? "minuto" : "minutos"}`;
  if (diffHours < 24)
    return `Hace ${diffHours} ${diffHours === 1 ? "hora" : "horas"}`;
  if (diffDays === 1) return "Hace 1 día";
  return `Hace ${diffDays} días`;
};

// Convertir audio de API a formato que espera AudioCard
export const convertToAudioItem = (audio: AudioFromAPI): AudioItem => {
  return {
    id: audio.audio_id,
    code: `SON-${audio.id.toString().padStart(3, "0")}`,
    voice: audio.profile_name,
    voiceName: audio.profile_name,
    text:
      audio.text.length > 100
        ? audio.text.substring(0, 100) + "..."
        : audio.text,
    duration: formatDuration(audio.duration),
    timeAgo: formatTimeAgo(audio.created_at),
    audio_url: audio.audio_url,
    waveform_url: audio.waveform_url,
  };
};
