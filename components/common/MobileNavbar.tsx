"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";

export function MobileNavbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/70 bg-background/80 px-4 backdrop-blur-xl md:hidden">
      {/* Logo + Sonara a la izquierda */}
      <Link href="/user/audios" className="flex items-center gap-2.5">
        <span className="flex size-8 items-center justify-center rounded-full border border-border bg-card shadow-sm">
          <Image
            alt="Sonara"
            className="size-5 w-auto dark:invert"
            src="/screen.png"
            width={20}
            height={20}
          />
        </span>
        <span className="text-base font-semibold tracking-tight text-foreground">
          Sonara
        </span>
      </Link>

      {/* Menú a la derecha */}
      <SidebarTrigger className="size-9 rounded-lg border border-border bg-card/60" />
    </header>
  );
}
