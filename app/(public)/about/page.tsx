import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  AudioLines,
  Code2,
  Layers,
  Mail,
  Mic2,
  Newspaper,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Conoce Sonara y el trabajo de Ernesto Orlando Mencahca Sardiñas, desarrollador web full-stack del sistema de generación de voz.",
};

const capabilities = [
  {
    icon: Mic2,
    title: "Clonación de voz",
    description:
      "Captura de timbre, tono y matices para construir voces consistentes.",
  },
  {
    icon: AudioLines,
    title: "Generación de locuciones",
    description:
      "Del guion al audio en un flujo claro, pensado para producción diaria.",
  },
  {
    icon: Newspaper,
    title: "Boletines y parrilla",
    description:
      "Organización de audios, horarios y contenido para salir al aire a tiempo.",
  },
  {
    icon: Users,
    title: "Operación y equipos",
    description:
      "Perfiles, permisos y administración para trabajar en equipo sin fricción.",
  },
];

const collaborators = [
  { name: "Rodolfo Pérez Alamino", initials: "RP" },
  { name: "Eduardo Melis", initials: "EM" },
];

export default function AboutPage() {
  return (
    <div className="page-container pb-24 pt-10 sm:pt-14 lg:pt-16">
      <div className="mx-auto max-w-5xl">
        {/* Migas de pan */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">
            Inicio
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-foreground">Nosotros</span>
        </div>

        {/* Encabezado */}
        <div className="mt-8 max-w-3xl">
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
            Nosotros
          </span>
          <h1 className="mt-3 text-4xl font-semibold leading-[1.08] text-foreground sm:text-5xl">
            Voz artificial.{" "}
            <span className="gold-gradient-text">Criterio humano.</span>
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Sonara es una plataforma de generación de voz para emisoras que
            necesitan sonar impecables sin sacrificar tiempo de producción. El
            sistema de generación fue desarrollado por{" "}
            <span className="font-medium text-foreground">
              Ernesto Orlando Mencahca Sardiñas
            </span>
            , desarrollador web full-stack, con colaboración técnica de
            Rodolfo Pérez Alamino y Eduardo Melis.
          </p>
        </div>

        {/* Contenido principal */}
        <div className="mt-12 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              <Code2 className="size-4 text-primary" />
              El sistema
            </div>

            <h2 className="mt-4 text-2xl font-semibold text-foreground sm:text-3xl">
              Ingeniería aplicada a la locución
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Sonara integra clonación de voz, generación de audio y producción
              de boletines en un mismo flujo. El sistema fue concebido para que
              un equipo de radio pase del guion al aire con la menor fricción
              posible.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {capabilities.map((capability) => (
                <div
                  key={capability.title}
                  className="rounded-xl border border-border/70 bg-muted/20 p-4"
                >
                  <div className="flex size-9 items-center justify-center rounded-lg border border-primary/15 bg-primary/10 text-primary">
                    <capability.icon className="size-4" />
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-foreground">
                    {capability.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {capability.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-start gap-2.5 rounded-lg border border-border/70 bg-background/60 p-3.5">
              <Layers className="mt-0.5 size-4 shrink-0 text-primary" />
              <p className="text-xs leading-relaxed text-muted-foreground">
                Desarrollo full-stack: interfaz, experiencia de uso, integración
                con servicios de audio y despliegue de la plataforma.
              </p>
            </div>
          </section>

          {/* Ficha del desarrollador */}
          <aside className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="relative h-24 overflow-hidden bg-linear-to-br from-primary/25 via-primary/5 to-transparent">
              <div className="absolute inset-0 bg-grid opacity-50 [mask-image:radial-gradient(ellipse_80%_80%_at_30%_0%,black,transparent_75%)]" />
            </div>

            <div className="flex flex-1 flex-col px-6 pb-6">
              <div className="-mt-8 flex size-16 items-center justify-center rounded-2xl border-4 border-card bg-primary text-lg font-semibold tracking-wide text-primary-foreground shadow-lg">
                EOM
              </div>

              <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.16em] text-primary">
                Desarrollo full-stack
              </p>
              <h2 className="mt-1.5 text-xl font-semibold leading-snug text-foreground">
                Ernesto Orlando Mencahca Sardiñas
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Desarrollador web full-stack
              </p>

              <div className="mt-5 rounded-xl border border-border/70 bg-muted/20 p-4">
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  Colaboración técnica
                </p>
                <ul className="mt-3 space-y-2.5">
                  {collaborators.map((person) => (
                    <li
                      key={person.name}
                      className="flex items-center gap-2.5"
                    >
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-card text-[10px] font-semibold text-muted-foreground">
                        {person.initials}
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {person.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 border-t border-border/70 pt-5 lg:mt-auto">
                <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  Contacto
                </p>
                <Button asChild className="h-10 w-full gap-2">
                  <a href="mailto:ernestoms91@gmail.com">
                    <Mail className="size-4" />
                    <span className="truncate">ernestoms91@gmail.com</span>
                    <ArrowUpRight className="ml-auto size-3.5 opacity-80" />
                  </a>
                </Button>
              </div>
            </div>
          </aside>
        </div>

        {/* Cierre */}
        <section className="mt-5 flex flex-col items-start justify-between gap-5 rounded-2xl border border-primary/20 bg-primary/[0.04] p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <h2 className="text-lg font-semibold text-foreground sm:text-xl">
              ¿Quieres integrar Sonara en tu emisora?
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              Consultas sobre el sistema, integraciones o soporte técnico.
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button asChild variant="outline" className="h-10 gap-2">
              <Link href="/">
                <ArrowLeft className="size-4" />
                Volver al inicio
              </Link>
            </Button>
            <Button asChild className="h-10 gap-2">
              <a href="mailto:ernestoms91@gmail.com">
                <Mail className="size-4" />
                Escribir un correo
              </a>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
