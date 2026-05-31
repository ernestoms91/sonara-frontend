"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";

export function MobileNavbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background px-4 md:hidden">
      {/* Logo + Sonara a la izquierda */}
      <div className="flex items-center gap-2">
        <Image
          alt="Sonara Logo"
          className="h-6 w-auto dark:invert"
          src="/screen.png"
          width={24}
          height={24}
        />
        <span className="text-lg font-semibold text-primary">Sonara</span>
      </div>

      {/* Hamburguesa a la derecha */}
      <SidebarTrigger />
    </header>
  );
}
