import { Footer } from "@/components/common/Footer";
import { Navbar } from "@/components/common/Navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // ← Te faltaba este return
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto p-4">{children}</main>
      <Footer />
    </div>
  );
}
