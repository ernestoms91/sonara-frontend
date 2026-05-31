"use client";

import { FileText } from "lucide-react";

export function TextEditorCard() {
  return (
    <div className="md:col-span-4 bg-card border border-border rounded-2xl p-8 group transition-all duration-300 hover:shadow-lg hover:bg-primary/5 dark:hover:border-primary/30">
      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
        <FileText className="w-7 h-7 text-primary" />
      </div>
      <h3 className="text-2xl font-bold mb-4 text-foreground">
        Editor basado en texto
      </h3>
      <p className="text-muted-foreground mb-6">
        Escribe y edita como si fuera un documento. Cambia la entonación
        simplemente editando el texto.
      </p>

      <div className="bg-background p-5 rounded-xl border border-border font-mono text-sm leading-relaxed text-foreground/80 transition-colors shadow-sm">
        <span className="text-primary font-bold">Narrador:</span>{" "}
        &quot;Bienvenidos a{" "}
        <span className="bg-primary/10 px-1 border-b-2 border-primary">
          Sonara
        </span>
        , el futuro de la voz...&quot;
      </div>
    </div>
  );
}
