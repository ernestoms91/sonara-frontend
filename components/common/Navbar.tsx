"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle-dynamic";

const navLinks = [
  { href: "/#caracteristicas", label: "Características" },
  { href: "/#estudio", label: "Estudio" },
];

export function Navbar() {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-background/75 backdrop-blur-xl">
      <div className="page-container flex h-16 items-center justify-between gap-4 lg:h-20">
        {/* Marca */}
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-full border border-border bg-card shadow-sm transition-colors group-hover:border-primary/40 lg:size-10">
            <Image
              alt="Sonara"
              className="size-6 w-auto transition-opacity group-hover:opacity-80 dark:invert lg:size-7"
              src="/screen.png"
              width={28}
              height={28}
              priority
            />
          </span>
          <span className="text-lg font-semibold tracking-tight text-foreground lg:text-xl">
            Sonara
          </span>
        </Link>

        {/* Navegación central */}
        {!isLoginPage && (
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}

        {/* Acciones */}
        <div className="flex items-center gap-2">
          <ModeToggle />
          {!isLoginPage && (
            <Button asChild size="sm" className="h-9 gap-1.5 px-3.5 sm:px-4">
              <Link href="/login">
                <span className="hidden sm:inline">Iniciar sesión</span>
                <span className="sm:hidden">Entrar</span>
                <ArrowUpRight className="size-3.5 opacity-80" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
