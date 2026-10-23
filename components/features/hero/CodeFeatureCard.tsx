"use client";

import { Radio } from "lucide-react";

export function CodeFeatureCard() {
  return (
    <div className="group relative flex flex-col items-center justify-between gap-8 overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 md:col-span-8 md:flex-row md:gap-6 md:p-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-20 size-64 rounded-full bg-primary/5 blur-3xl"
      />

      <div className="relative w-full md:max-w-xs">
        <div className="flex size-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
          <Radio className="size-6 text-primary" />
        </div>
        <h3 className="mt-6 text-2xl font-semibold text-foreground lg:text-3xl">
          Integración con sistemas de radio
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Conecta Sonara con tu automatización de radio. Genera locuciones en
          tiempo real para cortinas, promos y programas.
        </p>
      </div>

      <div className="relative w-full overflow-hidden rounded-xl border border-border bg-muted/40 shadow-sm transition-transform duration-500 md:max-w-sm md:translate-x-3 md:group-hover:translate-x-0">
        <div className="flex items-center justify-between border-b border-border/70 bg-card/60 px-4 py-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            en vivo
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-primary">
            <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
            on air
          </span>
        </div>
        <pre className="whitespace-pre-wrap p-4 font-mono text-[11px] leading-relaxed text-foreground/75 sm:text-xs">
          <code>{`"Bienvenidos a la mañana...
Con la voz de Sonara AI.

Cortina musical: 15 segundos
Locutor: Juan Carlos
Tono: Energético

Generando audio en 3, 2, 1..."`}</code>
        </pre>
      </div>
    </div>
  );
}
