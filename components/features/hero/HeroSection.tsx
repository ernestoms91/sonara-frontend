"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const highlights = [
  "Clonación en 30 segundos",
  "Voces en español neutro",
  "WAV · MP3 · FLAC",
];

export function HeroSection() {
  return (
    <section className="page-container relative pt-14 text-center sm:pt-20 lg:pt-24">
      <div className="mx-auto flex max-w-4xl flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/60" />
            <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
          </span>
          <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">
            Audio IA para radio
          </span>
        </div>

        {/* Título */}
        <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.05] text-foreground sm:text-5xl md:text-6xl lg:text-[4.25rem]">
          Clona, dicta y crea con{" "}
          <span className="gold-gradient-text">Sonara.</span>
        </h1>

        {/* Descripción */}
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Voces de locución profesionales generadas con IA. Generación rápida,
          clonación precisa y flujos de trabajo pensados para emisoras.
        </p>

        {/* Acciones */}
        <div className="mt-9 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
          <Button
            asChild
            className="h-11 w-full gap-2 rounded-xl px-6 text-sm shadow-lg shadow-primary/15 sm:w-auto"
          >
            <Link href="/login">
              Comenzar ahora
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-11 w-full gap-2 rounded-xl border-border bg-card/60 px-6 text-sm sm:w-auto"
          >
            <Link href="#caracteristicas">
              <Sparkles className="size-4 text-primary" />
              Ver características
            </Link>
          </Button>
        </div>

        {/* Señales de confianza */}
        <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground sm:text-[13px]">
          {highlights.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="size-1 rounded-full bg-primary/70" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
