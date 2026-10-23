//app/not-found.tsx
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative isolate flex min-h-svh flex-col items-center justify-center overflow-hidden bg-background px-4">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-ambient"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_45%,black,transparent_75%)]"
      />

      <div className="flex w-full max-w-md flex-col items-center rounded-2xl border border-border bg-card/80 px-6 py-12 text-center shadow-xl backdrop-blur-sm sm:px-10">
        <span className="flex size-12 items-center justify-center rounded-full border border-border bg-background shadow-sm">
          <Image
            alt="Sonara"
            className="size-7 w-auto dark:invert"
            src="/screen.png"
            width={28}
            height={28}
          />
        </span>

        <p className="mt-6 font-mono text-sm tracking-[0.3em] text-primary">
          404
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-foreground">
          Página no encontrada
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          La página que buscas no existe o ha sido movida.
        </p>

        <Button asChild className="mt-8 h-10 gap-2 px-5">
          <Link href="/user/audios">
            <ArrowLeft className="size-4" />
            Volver al inicio
          </Link>
        </Button>
      </div>
    </div>
  );
}
