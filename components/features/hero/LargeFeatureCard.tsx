"use client";

import Image from "next/image";
import { Mic2 } from "lucide-react";

export function LargeFeatureCard() {
  return (
    <div className="md:col-span-8 bg-card border border-border rounded-2xl p-8 flex flex-col justify-between group transition-all duration-300 hover:shadow-lg hover:bg-primary/5  dark:hover:border-primary/30">
      <div>
        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
          <Mic2 className="w-7 h-7 text-primary" />
        </div>
        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-foreground">
          Clonación de voz ultra-realista
        </h3>
        <p className="text-muted-foreground text-base md:text-lg max-w-md">
          Nuestra IA avanzada captura los matices emocionales y el tono exacto
          de cualquier voz con solo 30 segundos de muestra.
        </p>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-border shadow-sm">
        <Image
          alt="Professional studio"
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
          src="/studio.png"
          width={800}
          height={300}
        />
      </div>
    </div>
  );
}
