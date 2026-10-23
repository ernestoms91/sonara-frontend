import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Calendar,
  Check,
  Mail,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Términos de uso",
  description:
    "Condiciones de uso de Sonara: la plataforma proporciona las herramientas y el usuario es responsable de contar con consentimiento para utilizar voces.",
};

const lastUpdated = "23 de octubre de 2026";

const summary = [
  {
    title: "Solo proporcionamos la herramienta",
    description:
      "Sonara no presta la voz ni otorga autorizaciones de uso sobre ninguna persona.",
  },
  {
    title: "Consentimiento obligatorio",
    description:
      "Necesitas autorización previa, expresa e informada del titular de la voz.",
  },
  {
    title: "Tu contenido, tu responsabilidad",
    description:
      "Respondes por los audios que generas y por el uso que haces de ellos.",
  },
  {
    title: "Mal uso",
    description:
      "No nos hacemos responsables de voces utilizadas sin consentimiento.",
  },
];

function LegalSection({
  id,
  index,
  title,
  children,
}: {
  id: string;
  index: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-28 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
    >
      <div className="flex items-start gap-3">
        <span className="mt-1 font-mono text-[11px] tracking-[0.12em] text-primary">
          {index}
        </span>
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-foreground sm:text-xl">
            {title}
          </h2>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5">
          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/70" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function TermsPage() {
  return (
    <div className="page-container pb-24 pt-10 sm:pt-14 lg:pt-16">
      <div className="mx-auto max-w-5xl">
        {/* Migas de pan */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">
            Inicio
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-foreground">Términos</span>
        </div>

        {/* Encabezado */}
        <div className="mt-8 max-w-3xl">
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
            Legal
          </span>
          <h1 className="mt-3 text-4xl font-semibold leading-[1.08] text-foreground sm:text-5xl">
            Términos de uso
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Estas condiciones explican qué ofrece Sonara, qué responsabilidad
            asume cada parte y cómo usar la generación de voz de forma legítima.
            En resumen: nosotros ponemos la herramienta; tú pones el
            consentimiento.
          </p>
          <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="size-3.5" />
            Última actualización: {lastUpdated}
          </p>
        </div>

        {/* Aviso principal */}
        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-primary/25 bg-primary/[0.05] p-5 sm:p-6">
          <ShieldAlert className="mt-0.5 size-5 shrink-0 text-primary" />
          <div>
            <p className="text-sm font-semibold text-foreground">
              Sonara solo proporciona la herramienta
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              No clonamos voces por cuenta propia ni otorgamos consentimiento
              sobre ninguna voz. El uso de una voz requiere autorización previa,
              expresa e informada de su titular. No nos hacemos responsables del
              uso indebido de la plataforma ni de la generación de voces sin
              consentimiento.
            </p>
          </div>
        </div>

        {/* Contenido */}
        <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_20rem]">
          <div className="order-2 space-y-5 lg:order-1">
            <LegalSection id="servicio" index="01" title="El servicio">
              <p>
                Sonara es una plataforma de software que proporciona
                herramientas para generar locuciones, clonar voces y producir
                contenido de audio para radio.
              </p>
              <p>
                El servicio consiste en el acceso a esas herramientas. Sonara no
                presta servicios de locución, no representa a los titulares de
                las voces y no concede autorizaciones de uso sobre ninguna voz.
              </p>
              <p>
                Al crear una cuenta o utilizar la plataforma aceptas estos
                términos y la legislación aplicable.
              </p>
            </LegalSection>

            <LegalSection
              id="consentimiento"
              index="02"
              title="Consentimiento y derechos de voz"
            >
              <p>
                Para clonar o utilizar la voz de una persona necesitas su
                consentimiento previo, expreso e informado. La autorización debe
                cubrir el uso concreto que harás del audio: medio, campaña,
                duración y alcance.
              </p>
              <p>
                Sonara no verifica la existencia ni la validez de ese
                consentimiento. Obtenerlo y conservar la prueba es
                responsabilidad exclusiva de quien utiliza la herramienta.
              </p>
              <p>
                Si la voz pertenece a un menor, se requiere la autorización de
                su madre, padre o representante legal. Si la persona ha
                fallecido, se requiere la autorización de sus derechohabientes
                conforme a la ley.
              </p>
              <p>
                Si eres titular de una voz y consideras que se ha usado sin
                autorización, escríbenos a{" "}
                <a
                  href="mailto:ernestoms91@gmail.com"
                  className="font-medium text-foreground underline decoration-primary/40 underline-offset-4 transition-colors hover:decoration-primary"
                >
                  ernestoms91@gmail.com
                </a>{" "}
                para revisarlo.
              </p>
            </LegalSection>

            <LegalSection
              id="responsabilidad"
              index="03"
              title="Responsabilidad del usuario"
            >
              <p>
                El usuario es el único responsable del texto, las instrucciones,
                las voces seleccionadas, los audios generados y el uso que haga
                de ellos.
              </p>
              <p>
                Te comprometes a usar Sonara de forma lícita, transparente y
                respetuosa, y a responder frente a terceros por cualquier
                reclamación derivada de tu contenido o de la falta de
                consentimiento.
              </p>
              <p>
                Sonara no se hace responsable del uso indebido de la plataforma
                ni de los perjuicios que pueda causar la utilización de voces
                sin consentimiento.
              </p>
            </LegalSection>

            <LegalSection id="prohibido" index="04" title="Usos prohibidos">
              <BulletList
                items={[
                  "Clonar o replicar una voz sin autorización de su titular.",
                  "Suplantar la identidad de una persona o atribuirle declaraciones que no hizo.",
                  "Crear contenido fraudulento, difamatorio, de odio, violento o sexualmente explícito.",
                  "Usar el servicio para acosar, extorsionar o manipular a personas.",
                  "Eludir controles de acceso, revender el servicio o extraer datos sin permiso.",
                ]}
              />
              <p>
                El incumplimiento de estas reglas puede suponer la suspensión o
                cancelación de la cuenta.
              </p>
            </LegalSection>

            <LegalSection
              id="exclusion"
              index="05"
              title="Exclusión de responsabilidad"
            >
              <p>
                Sonara proporciona la herramienta, pero no controla ni supervisa
                el contenido que generan sus usuarios. Por ello, no se hace
                responsable del uso que se dé a los audios, de las voces
                utilizadas sin consentimiento ni de las consecuencias legales o
                económicas derivadas de ese uso.
              </p>
              <p>
                El servicio se ofrece “tal cual” y “según disponibilidad”. En la
                medida permitida por la ley, no garantizamos disponibilidad
                ininterrumpida, ausencia de errores ni resultados concretos.
              </p>
              <p>
                No seremos responsables de daños indirectos, incidentales,
                especiales o consecuentes, incluida la pérdida de ingresos o de
                reputación, en la medida permitida por la ley. Nada en estos
                términos limita las responsabilidades que no puedan excluirse
                legalmente.
              </p>
            </LegalSection>

            <LegalSection
              id="propiedad"
              index="06"
              title="Propiedad intelectual y cuenta"
            >
              <p>
                La plataforma, el software, la marca Sonara, el diseño y los
                contenidos propios son titularidad de Sonara o de sus
                licenciantes. No se concede ningún derecho salvo el uso normal
                del servicio.
              </p>
              <p>
                El usuario conserva los derechos sobre el contenido que genere.
                Al utilizarlo, autoriza a Sonara a alojarlo, procesarlo y
                mostrarlo únicamente para prestar el servicio.
              </p>
              <p>
                Las credenciales de acceso son personales e intransferibles.
                Debes mantenerlas seguras y notificar cualquier acceso no
                autorizado.
              </p>
            </LegalSection>

            <LegalSection id="cambios" index="07" title="Cambios y contacto">
              <p>
                Podemos actualizar estos términos para reflejar cambios legales
                o del servicio. Publicaremos la versión vigente con su fecha de
                actualización. El uso continuado después de un cambio implica su
                aceptación.
              </p>
              <p>
                Podemos modificar, suspender o discontinuar funciones por
                mantenimiento, seguridad o causas técnicas.
              </p>
              <p>
                Para consultas sobre estos términos, derechos de voz o
                solicitudes de retirada, escribe a{" "}
                <a
                  href="mailto:ernestoms91@gmail.com"
                  className="font-medium text-foreground underline decoration-primary/40 underline-offset-4 transition-colors hover:decoration-primary"
                >
                  ernestoms91@gmail.com
                </a>
                .
              </p>
            </LegalSection>

            <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-center">
              <p className="text-sm text-muted-foreground">
                ¿Tienes dudas sobre estos términos?
              </p>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline" className="h-9 gap-2">
                  <Link href="/">
                    <ArrowLeft className="size-4" />
                    Volver al inicio
                  </Link>
                </Button>
                <Button asChild className="h-9 gap-2">
                  <a href="mailto:ernestoms91@gmail.com">
                    <Mail className="size-4" />
                    Contactar
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Resumen lateral */}
          <aside className="order-1 space-y-5 lg:order-2 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                En resumen
              </p>
              <ul className="mt-4 space-y-4">
                {summary.map((item) => (
                  <li key={item.title} className="flex gap-3">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-primary/15 bg-primary/10 text-primary">
                      <Check className="size-3.5" />
                    </span>
                    <div>
                      <p className="text-sm font-medium leading-snug text-foreground">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-5 border-t border-border/70 pt-4">
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  Vigencia
                </p>
                <p className="mt-1 text-sm text-foreground">{lastUpdated}</p>
              </div>
            </div>

            <div className="hidden rounded-2xl border border-border bg-card p-5 shadow-sm lg:block">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Contacto legal
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Derechos de voz, solicitudes de retirada o dudas sobre estos
                términos.
              </p>
              <Button asChild className="mt-4 h-9 w-full gap-2">
                <a href="mailto:ernestoms91@gmail.com">
                  <Mail className="size-4" />
                  <span className="truncate">ernestoms91@gmail.com</span>
                  <ArrowUpRight className="ml-auto size-3.5 opacity-80" />
                </a>
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
