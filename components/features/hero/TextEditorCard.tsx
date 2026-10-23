"use client";

import { FileText } from "lucide-react";

export function TextEditorCard() {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 md:col-span-4 md:p-8">
      <div className="flex size-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
        <FileText className="size-6 text-primary" />
      </div>
      <h3 className="mt-6 text-xl font-semibold text-foreground lg:text-2xl">
        Editor basado en texto
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Escribe y edita como si fuera un documento. Cambia la entonación
        simplemente editando el texto.
      </p>

      <div className="mt-6 rounded-xl border border-border bg-muted/40 p-4 md:mt-auto">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Guion
          </span>
          <span className="rounded border border-border bg-card px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            ES
          </span>
        </div>
        <p className="font-mono text-[13px] leading-relaxed text-foreground/80">
          <span className="font-semibold text-primary">Narrador:</span>{" "}
          &quot;Bienvenidos a{" "}
          <span className="rounded-sm bg-primary/15 px-1 text-foreground underline decoration-primary/50 decoration-2 underline-offset-2">
            Sonara
          </span>
          , el futuro de la voz...&quot;
        </p>
      </div>
    </div>
  );
}
