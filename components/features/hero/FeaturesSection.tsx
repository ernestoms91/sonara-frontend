"use client";

import { LargeFeatureCard } from "@/components/features/hero/LargeFeatureCard";
import { TextEditorCard } from "@/components/features/hero/TextEditorCard";
import { FeatureCard } from "@/components/features/hero/FeatureCard";
import { CodeFeatureCard } from "@/components/features/hero/CodeFeatureCard";

export function FeaturesSection() {
  return (
    <section id="caracteristicas" className="page-container scroll-mt-24 pb-24 lg:pb-32">
      {/* Header */}
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
          Todo en un solo lugar
        </span>
        <h2 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl lg:text-[2.75rem]">
          Herramientas profesionales, sin compromisos
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          Todo lo que necesitas para clonar y generar voces en un solo lugar.
        </p>
      </div>

      {/* Grid de features */}
      <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-12 lg:mt-14 lg:gap-6">
        <LargeFeatureCard />
        <TextEditorCard />
        <FeatureCard />
        <CodeFeatureCard />
      </div>
    </section>
  );
}
