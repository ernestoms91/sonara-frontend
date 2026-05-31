// components/features/audios/Waveform.tsx
"use client";

import { useEffect, useRef, useState } from "react";

interface WaveformProps {
  waveformUrl: string;
  className?: string;
}

// Componente simple
export function Waveform({ waveformUrl, className = "" }: WaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [waveformData, setWaveformData] = useState<number[]>([]);

  useEffect(() => {
    if (!waveformUrl) return;

    const fetchWaveform = async () => {
      try {
        const response = await fetch(waveformUrl);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        // Asegurar que data.data existe y es un array
        if (data && Array.isArray(data.data)) {
          setWaveformData(data.data);
        } else {
          console.warn("Waveform data is not an array:", data);
          setWaveformData([]);
        }
      } catch (error) {
        console.error("Error loading waveform:", error);
        setWaveformData([]);
      }
    };

    fetchWaveform();
  }, [waveformUrl]);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (!waveformData || waveformData.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    const maxValue = Math.max(...waveformData);
    const minValue = Math.min(...waveformData);
    const range = maxValue - minValue;
    const barWidth = width / waveformData.length;

    for (let i = 0; i < waveformData.length; i++) {
      const normalizedValue =
        range === 0 ? 0 : (waveformData[i] - minValue) / range;
      const barHeight = Math.max(2, normalizedValue * height);
      const x = i * barWidth;
      const y = (height - barHeight) / 2;

      const intensity = normalizedValue;
      const r = 172 + Math.floor(63 * intensity);
      const g = 140 + Math.floor(40 * intensity);
      const b = 57 + Math.floor(30 * intensity);

      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(x, y, barWidth - 0.5, barHeight);
    }
  }, [waveformData]);

  return (
    <canvas
      ref={canvasRef}
      className={`h-12 w-full ${className}`}
      style={{ height: "48px", width: "100%" }}
    />
  );
}

// Componente con progreso
interface WaveformWithProgressProps {
  waveformUrl: string;
  currentTime: number;
  duration: number;
  className?: string;
}

export function WaveformWithProgress({
  waveformUrl,
  currentTime,
  duration,
  className = "",
}: WaveformWithProgressProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!waveformUrl) return;

    const fetchWaveform = async () => {
      setLoading(true);
      try {
        const response = await fetch(waveformUrl);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        // ✅ Verificación segura
        if (data && Array.isArray(data.data)) {
          setWaveformData(data.data);
        } else {
          console.warn("Waveform data is not an array:", data);
          setWaveformData([]);
        }
      } catch (error) {
        console.error("Error loading waveform:", error);
        setWaveformData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWaveform();
  }, [waveformUrl]);

  useEffect(() => {
    // ✅ Verificación más segura con múltiples condiciones
    if (!canvasRef.current) return;
    if (loading) return;
    if (!waveformData || waveformData.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    const maxValue = Math.max(...waveformData);
    const minValue = Math.min(...waveformData);
    const range = maxValue - minValue;
    const barWidth = width / waveformData.length;

    // Calcular hasta qué índice debe estar lleno
    const progressPercent = duration > 0 ? currentTime / duration : 0;
    const filledIndex = Math.floor(waveformData.length * progressPercent);

    for (let i = 0; i < waveformData.length; i++) {
      const normalizedValue =
        range === 0 ? 0 : (waveformData[i] - minValue) / range;
      const barHeight = Math.max(2, normalizedValue * height);
      const x = i * barWidth;
      const y = (height - barHeight) / 2;

      const isFilled = i <= filledIndex;

      if (isFilled) {
        const intensity = normalizedValue;
        const r = 172 + Math.floor(63 * intensity);
        const g = 140 + Math.floor(40 * intensity);
        const b = 57 + Math.floor(30 * intensity);
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      } else {
        ctx.fillStyle = "rgba(172, 140, 57, 0.25)";
      }

      ctx.fillRect(x, y, barWidth - 0.5, barHeight);
    }
  }, [waveformData, currentTime, duration, loading]);

  // Mostrar un placeholder mientras carga
  if (loading) {
    return (
      <div
        className={`h-12 w-full rounded-md bg-muted animate-pulse ${className}`}
        style={{ height: "48px", width: "100%" }}
      />
    );
  }

  // Si no hay datos, mostrar un placeholder vacío
  if (!waveformData || waveformData.length === 0) {
    return (
      <div
        className={`h-12 w-full rounded-md bg-muted/50 ${className}`}
        style={{ height: "48px", width: "100%" }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className={`h-12 w-full rounded-md ${className}`}
      style={{ height: "48px", width: "100%" }}
    />
  );
}
