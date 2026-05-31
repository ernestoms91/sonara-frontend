import { LoginForm } from "@/components/features/auth/LoginForm";

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center lg:pt-24 pb-12 px-4">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </main>
    </div>
  );
}
