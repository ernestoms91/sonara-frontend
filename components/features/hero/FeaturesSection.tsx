"use client";

import { LargeFeatureCard } from "@/components/features/hero/LargeFeatureCard";
import { TextEditorCard } from "@/components/features/hero/TextEditorCard";
import { FeatureCard } from "@/components/features/hero/FeatureCard";
import { CodeFeatureCard } from "@/components/features/hero/CodeFeatureCard";

export function FeaturesSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 pt-10 md:pt-15 lg:px-12 mb-32">
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
          Herramientas profesionales, sin compromisos
        </h2>
        <p className="text-base md:text-lg text-muted-foreground">
          Todo lo que necesitas para clonar y generar voces en un solo lugar.
        </p>
      </div>

      {/* Grid de features */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Tarjeta grande - Clonación de voz */}
        <LargeFeatureCard />

        {/* Tarjeta - Editor de texto */}
        <TextEditorCard />

        {/* Tarjeta - Exportación */}
        <FeatureCard />

        {/* Tarjeta grande - API */}
        <CodeFeatureCard />
      </div>
    </section>
  );
}
