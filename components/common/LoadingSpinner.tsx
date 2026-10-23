// components/ui/LoadingSpinner.tsx
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  text?: string;
  className?: string;
  spinnerClassName?: string;
  textClassName?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export function LoadingSpinner({
  text = "Cargando...",
  className,
  spinnerClassName,
  textClassName,
  size = "md",
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        "flex min-h-[60vh] items-center justify-center",
        className,
      )}
    >
      <div className="text-center">
        <div
          className={cn(
            "mx-auto mb-4 animate-spin rounded-full border-[3px] border-primary border-t-transparent",
            sizeClasses[size],
            spinnerClassName,
          )}
        />
        <p className={cn("text-sm text-muted-foreground", textClassName)}>
          {text}
        </p>
      </div>
    </div>
  );
}
