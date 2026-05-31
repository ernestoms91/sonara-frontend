"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/ui/mode-toggle-dynamic";

export function Navbar() {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-6 lg:px-12 h-16 lg:h-20">
        {/* Logo y marca */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              alt="Sonara Logo"
              className="h-8 w-auto lg:h-10 lg:w-auto dark:invert transition-opacity group-hover:opacity-80"
              src="/screen.png"
              width={32}
              height={32}
              priority
            />
            <span className="text-xl lg:text-2xl font-bold text-primary group-hover:text-primary/80 transition-colors">
              Sonara
            </span>
          </Link>
        </div>

        {/* Acciones derecha */}
        <div className="flex items-center gap-4">
          {/* Mostrar Login solo si NO estamos en la página de login */}
          {!isLoginPage && (
            <Link
              href="/login"
              className="text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-md hover:bg-muted/50"
            >
              Login
            </Link>
          )}
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}
