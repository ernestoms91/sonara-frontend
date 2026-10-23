"use client";

import Image from "next/image";
import Link from "next/link";

const productLinks = [
  { href: "/#caracteristicas", label: "Características" },
  { href: "/#estudio", label: "Estudio" },
  { href: "/login", label: "Acceder" },
];

const legalLinks = [
  { href: "/about", label: "Nosotros" },
  { href: "/terms", label: "Términos" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/70 bg-muted/20">
      <div className="page-container py-10 md:py-12 lg:py-14">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-[1.6fr_1fr_1fr] md:gap-10">
          {/* Marca */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-full border border-border bg-card shadow-sm">
                <Image
                  alt="Sonara"
                  className="size-6 w-auto dark:invert"
                  src="/screen.png"
                  width={24}
                  height={24}
                />
              </span>
              <span className="text-lg font-semibold tracking-tight text-foreground">
                Sonara
              </span>
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground md:mt-4 md:max-w-xs">
              Locución con IA para emisoras que quieren sonar impecables, todos
              los días.
            </p>
          </div>

          {/* Producto */}
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground md:text-xs">
              Producto
            </p>
            <ul className="mt-3 space-y-2 md:mt-4 md:space-y-2.5">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-muted-foreground transition-colors hover:text-foreground md:text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Compañía */}
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground md:text-xs">
              Compañía
            </p>
            <ul className="mt-3 space-y-2 md:mt-4 md:space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-muted-foreground transition-colors hover:text-foreground md:text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-2 border-t border-border/70 pt-5 text-center sm:mt-10 sm:flex-row sm:justify-between sm:gap-3 sm:pt-6 sm:text-left">
          <p className="text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
            © {currentYear} Sonara AI. Todos los derechos reservados.
          </p>
          <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground sm:text-xs">
            <span className="size-1.5 rounded-full bg-primary" />
            Hecho para la radio
          </p>
        </div>
      </div>
    </footer>
  );
}
