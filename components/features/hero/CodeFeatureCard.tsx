"use client";

import { Radio } from "lucide-react";

export function CodeFeatureCard() {
  return (
    <div className="md:col-span-8 bg-card border border-border rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between group overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/40 dark:hover:border-primary/30 hover:bg-primary/5 dark:hover:bg-primary/5">
      <div className="max-w-xs w-full mb-8 md:mb-0">
        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
          <Radio className="w-7 h-7 text-primary" />
        </div>
        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-foreground">
          Integración con sistemas de radio
        </h3>
        <p className="text-muted-foreground">
          Conecta Sonara con tu automatización de radio. Genera locuciones en
          tiempo real para cortinas, promos y programas.
        </p>
      </div>

      <div className="w-full md:w-auto bg-background p-6 rounded-xl border border-border font-mono text-xs text-primary/80 md:translate-x-4 group-hover:translate-x-0 transition-all duration-500 shadow-sm">
        <pre className="text-foreground/80 whitespace-pre-wrap">
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
