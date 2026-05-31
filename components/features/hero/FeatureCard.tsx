"use client";

import { Download } from "lucide-react";

export function FeatureCard() {
  return (
    <div className="md:col-span-4 bg-card border border-border rounded-2xl p-8 transition-all duration-300 hover:shadow-lg  hover:bg-primary/5 dark:hover:border-primary/30">
      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
        <Download className="w-7 h-7 text-primary" />
      </div>
      <h3 className="text-2xl font-bold mb-4 text-foreground">
        Exportación multiformato
      </h3>
      <p className="text-muted-foreground">
        Descarga tus creaciones en WAV, MP3 o FLAC de alta resolución con un
        solo clic.
      </p>
    </div>
  );
}
