import { Footer } from "@/components/common/Footer";
import { Navbar } from "@/components/common/Navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative isolate flex min-h-svh flex-col overflow-x-clip bg-background">
      {/* Fondo ambiental del sitio: brillo dorado + retícula sutil */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[46rem] overflow-hidden"
      >
        <div className="absolute inset-0 bg-ambient" />
        <div className="absolute inset-0 bg-grid opacity-70 [mask-image:radial-gradient(ellipse_70%_58%_at_50%_0%,black,transparent_78%)]" />
      </div>

      <Navbar />
      <main className="flex flex-1 flex-col pt-16 lg:pt-20">{children}</main>
      <Footer />
    </div>
  );
}
