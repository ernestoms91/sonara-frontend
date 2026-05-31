"use client";

import Image from "next/image";
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-12 bg-background border-t border-border transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Logo y copyright */}
        <div className="flex flex-col items-center md:items-start gap-3">
          <div className="flex items-center gap-2">
            <Image
              alt="Sonara Logo"
              className="h-6 w-auto"
              src="/screen.png"
              width={24}
              height={24}
            />
            <span className="text-xl font-bold text-primary">Sonara</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {currentYear} Sonara AI. Todos los derechos reservados.
          </p>
        </div>

        {/* Enlaces */}
        <div className="flex gap-6">
          <Link
            href="/about"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            About
          </Link>
          <Link
            href="/terms"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Términos
          </Link>
        </div>
      </div>
    </footer>
  );
}
