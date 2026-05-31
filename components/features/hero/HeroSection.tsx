"use client";

export function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-12 text-center pt-20 lg:pt-25  lg:pb-20">
      {/* Badge decorativo */}
      <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-8">
        <span className="text-sm text-primary uppercase tracking-wider flex items-center gap-2">
          <span className="text-primary">🎵</span>
          <span className="hidden sm:inline">
            La Próxima Generación de Audio para la Radio
          </span>
          <span className="sm:hidden">Audio IA para Radio</span>
        </span>
      </div>

      {/* Título principal */}
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 max-w-4xl mx-auto text-foreground">
        Clona, dicta y crea con <span className="text-primary">Sonara.</span>
      </h1>

      {/* Descripción */}
      <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
        Voces de locución profesionales generadas con IA. Generación rápida,
        clonación precisa y flujos de trabajo optimizados.
      </p>
    </section>
  );
}
