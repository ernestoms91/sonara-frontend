// components/features/audios/CreateAudioDialog.tsx
"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface CreateAudioDialogProps {
  onSuccess?: () => void;
}

export function CreateAudioDialog({ onSuccess }: CreateAudioDialogProps) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) {
      toast.error("Por favor, escribe un texto");
      return;
    }

    setIsLoading(true);

    try {
      const result = await createAudio(text);
      //   const result = await createAudio(text);

      if (result.success) {
        toast.success("Audio generado correctamente");
        setText("");
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error(result.error || "Error al generar el audio");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al generar el audio");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="size-4" />
          Nuevo<span className="hidden lg:inline"> Audio</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Crear nuevo audio</DialogTitle>
            <DialogDescription>
              Escribe el texto que quieres convertir a voz.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Escribe tu texto aquí..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              className="resize-none"
              disabled={isLoading}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              {text.length} / 1000 caracteres
            </p>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || !text.trim()}>
              {isLoading ? "Generando..." : "Generar Audio"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
