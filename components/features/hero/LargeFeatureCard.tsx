"use client";

import Image from "next/image";
import { Mic2 } from "lucide-react";

export function LargeFeatureCard() {
  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 md:col-span-8 md:p-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-28 size-72 rounded-full bg-primary/5 blur-3xl"
      />

      <div className="relative">
        <div className="flex size-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
          <Mic2 className="size-6 text-primary" />
        </div>
        <h3 className="mt-6 text-2xl font-semibold text-foreground lg:text-3xl">
          Clonación de voz ultra-realista
        </h3>
        <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground md:text-base">
          Nuestra IA avanzada captura los matices emocionales y el tono exacto
          de cualquier voz con solo 30 segundos de muestra.
        </p>
      </div>

      <div className="relative mt-8 overflow-hidden rounded-xl border border-border/70">
        <Image
          alt="Estudio de grabación profesional"
          className="h-56 w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] md:h-64"
          src="/studio.png"
          width={900}
          height={400}
        />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/55 via-black/5 to-transparent" />
        <div className="absolute inset-x-4 bottom-3 flex items-center justify-between gap-3">
          <span className="rounded-full border border-white/20 bg-black/30 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-white/90 backdrop-blur-sm">
            Estudio profesional
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.14em] text-white/80 sm:block">
            Tono · Timbre · Emoción
          </span>
        </div>
      </div>
    </div>
  );
}
