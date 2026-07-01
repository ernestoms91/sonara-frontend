//app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <h2 className="mt-4 text-2xl font-semibold">Página no encontrada</h2>
      <p className="mt-2 text-muted-foreground">
        La página que buscas no existe o ha sido movida.
      </p>
      <Link
        href="/user/audios"
        className="mt-6 rounded-lg bg-primary px-6 py-3 text-primary-foreground hover:bg-primary/90"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
