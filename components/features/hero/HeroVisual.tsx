"use client";

import { useEffect, useState } from "react";

export function HeroVisual() {
  const [bars, setBars] = useState(
    Array.from({ length: 12 }, () => ({ active: false, height: 8 })),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setBars((prev) =>
        prev.map(() => {
          const active = Math.random() > 0.6;
          return {
            active,
            height: active ? Math.floor(Math.random() * 40) + 16 : 8,
          };
        }),
      );
    }, 120);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-6xl mx-auto aspect-video rounded-2xl lg:rounded-3xl overflow-hidden border border-border bg-card shadow-xl">
      {/* Gradiente de fondo */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-primary/10" />

      {/* Círculo radial decorativo */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(172,140,57,0.08),transparent_70%)]" />

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-6 ">
        {/* Micrófono con vibración */}
        <div className="relative mb-4 lg:mb-8">
          {/* Ondas de sonido - AHORA SÍ se ven porque tienen posición absoluta */}
          <div className="absolute inset-0 rounded-full animate-ripple bg-primary/20" />
          <div className="absolute inset-0 rounded-full animate-ripple-delayed bg-primary/10" />
          <div className="absolute inset-0 rounded-full animate-ripple-slow bg-primary/5" />

          {/* Círculo del micrófono con vibración */}
          <div className="relative p-2 lg:p-5 rounded-full bg-primary/10 border border-primary/20 ">
            <svg
              className="w-6 h-6 sm:w-8 sm:h-8 md:w-14 md:h-14 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
          </div>
        </div>

        {/* Barras del espectro */}
        <div className="flex items-end gap-1 sm:gap-1.5 lg:gap-2 h-24 sm:h-28 lg:h-40">
          {bars.map((bar, i) => (
            <div
              key={i}
              className="w-1.5 sm:w-2 lg:w-3 bg-linear-to-t from-primary to-primary/40 rounded-full transition-all duration-150"
              style={{
                height: `${bar.height}px`,
                opacity: bar.active ? 1 : 0.4,
              }}
            />
          ))}
        </div>

        {/* Texto de estado */}
        <p className="text-[10px] sm:text-xs lg:text-sm font-mono text-muted-foreground mt-4 lg:mt-8 tracking-widest uppercase animate-pulse">
          ESCUCHANDO VOZ MAESTRA...
        </p>
      </div>
    </div>
  );
}
