import { LoginForm } from "@/components/features/auth/LoginForm";

export default function Login() {
  return (
    <div className="page-container relative flex flex-1 items-center justify-center py-12 lg:py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-72 w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="w-full max-w-[26rem]">
        <LoginForm />
        <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
          Acceso restringido a emisoras y equipos autorizados.
        </p>
      </div>
    </div>
  );
}
