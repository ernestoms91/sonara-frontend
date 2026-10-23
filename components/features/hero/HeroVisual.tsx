"use client";

import { useEffect, useState } from "react";
import { Activity, Mic2, Play } from "lucide-react";

const initialBars = [
  18, 44, 62, 32, 78, 54, 28, 66, 92, 48, 30, 58, 42, 74, 52, 24, 70, 46, 34,
  60, 84, 38, 50, 68, 26, 62, 44, 36,
];

export function HeroVisual() {
  const [bars, setBars] = useState(
    initialBars.map((height) => ({ active: height > 20, height })),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setBars((prev) =>
        prev.map(() => {
          const active = Math.random() > 0.55;
          return {
            active,
            height: active ? Math.floor(Math.random() * 46) + 22 : 10,
          };
        }),
      );
    }, 130);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="estudio"
      className="relative mx-auto w-full max-w-6xl scroll-mt-24 px-4 pb-20 pt-12 sm:px-6 lg:px-8 lg:pb-24 lg:pt-16"
    >
      {/* Halo detrás del panel */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-16 top-16 -z-10 h-56 rounded-full bg-primary/10 blur-3xl lg:h-72"
      />

      <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/5 ring-1 ring-black/[0.03] sm:rounded-3xl dark:shadow-black/40 dark:ring-white/5">
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />

        {/* Barra superior tipo ventana */}
        <div className="flex items-center justify-between gap-3 border-b border-border/70 bg-muted/30 px-4 py-2.5 sm:px-5">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-destructive/60" />
            <span className="size-2.5 rounded-full bg-primary/50" />
            <span className="size-2.5 rounded-full bg-emerald-500/50" />
          </div>
          <span className="truncate font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Sonara Studio · Voz maestra
          </span>
          <span className="hidden items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground sm:flex">
            <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
            En vivo
          </span>
        </div>

        {/* Lienzo del estudio */}
        <div className="relative flex min-h-[340px] flex-col overflow-hidden sm:aspect-[16/9] sm:min-h-0 lg:aspect-[2.3/1]">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-primary/5"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-grid opacity-40 [--grid-size:48px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent_78%)]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 50% 45%, color-mix(in oklab, var(--primary) var(--studio-glow), transparent), transparent 62%)",
            }}
          />

          <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-4 px-6 py-6 sm:gap-6 lg:gap-7">
            {/* Micrófono con ondas */}
            <div className="relative">
              <div className="absolute inset-0 animate-ripple rounded-full bg-primary/20" />
              <div className="absolute inset-0 animate-ripple-delayed rounded-full bg-primary/10" />
              <div className="absolute inset-0 animate-ripple-slow rounded-full bg-primary/5" />
              <div className="relative flex size-14 items-center justify-center rounded-full border border-primary/20 bg-card/80 shadow-sm backdrop-blur-sm sm:size-16 lg:size-20">
                <Mic2 className="size-6 text-primary sm:size-7 lg:size-8" />
              </div>
            </div>

            {/* Espectro */}
            <div className="flex h-24 w-full max-w-2xl items-end justify-center gap-[3px] sm:h-28 sm:gap-1.5 lg:h-36">
              {bars.map((bar, i) => (
                <div
                  key={i}
                  className="w-1 rounded-full bg-linear-to-t from-primary to-primary/30 transition-all duration-150 sm:w-1.5 lg:w-2"
                  style={{
                    height: `${bar.height}px`,
                    opacity: bar.active ? 1 : 0.45,
                  }}
                />
              ))}
            </div>

            <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground lg:text-[11px]">
              <Activity className="size-3 text-primary" />
              Escuchando voz maestra…
            </p>
          </div>

          {/* Barra de transporte decorativa */}
          <div
            aria-hidden="true"
            className="relative z-10 flex items-center gap-3 border-t border-border/60 bg-card/50 px-4 py-3 backdrop-blur-sm sm:px-6"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
              <Play className="ml-0.5 size-3.5 fill-primary-foreground" />
            </span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-primary/15">
              <div className="h-full w-[38%] rounded-full bg-linear-to-r from-primary/70 to-primary" />
            </div>
            <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
              00:12 / 00:30
            </span>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70 sm:block">
              44.1 kHz · 24 bit
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
