"use client";

import { Download } from "lucide-react";

const formats = ["WAV", "MP3", "FLAC"];

export function FeatureCard() {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 md:col-span-4 md:p-8">
      <div className="flex size-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
        <Download className="size-6 text-primary" />
      </div>
      <h3 className="mt-6 text-xl font-semibold text-foreground lg:text-2xl">
        Exportación multiformato
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Descarga tus creaciones en WAV, MP3 o FLAC de alta resolución con un
        solo clic.
      </p>

      <div className="mt-6 flex flex-wrap gap-2 border-t border-border/70 pt-5 md:mt-auto">
        {formats.map((format) => (
          <span
            key={format}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/50 px-2 py-1 font-mono text-[11px] text-foreground/80"
          >
            <span className="size-1 rounded-full bg-primary" />
            {format}
          </span>
        ))}
      </div>
    </div>
  );
}
