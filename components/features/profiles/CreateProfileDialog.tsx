// components/features/profiles/CreateProfileDialog.tsx
"use client";

import { useState, useTransition } from "react";
import { Plus, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createProfile } from "@/app/actions/profile.actions";
import { Profile } from "@/types/api";

interface CreateProfileDialogProps {
  onSuccess?: (newProfile: Profile) => void;
}

export function CreateProfileDialog({ onSuccess }: CreateProfileDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState("");
  const [refText, setRefText] = useState("");
  const [language, setLanguage] = useState("Spanish");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioFileName, setAudioFileName] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      setAudioFileName(file.name);
    }
  };

  const removeFile = () => {
    setAudioFile(null);
    setAudioFileName("");
    const input = document.getElementById("audio-file") as HTMLInputElement;
    if (input) input.value = "";
  };

  const resetForm = () => {
    setName("");
    setRefText("");
    setLanguage("Spanish");
    setAudioFile(null);
    setAudioFileName("");
    setOpen(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("El nombre es requerido");
      return;
    }

    if (!refText.trim()) {
      toast.error("El texto de referencia es requerido");
      return;
    }

    if (!audioFile) {
      toast.error("Debes seleccionar un archivo de audio");
      return;
    }

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("name", name.trim());
        formData.append("ref_text", refText.trim());
        formData.append("language", language);
        formData.append("audio_file", audioFile);

        const result = await createProfile(formData);

        if (!result.success) {
          toast.error(result.error || "Error al crear perfil");
          return;
        }

        toast.success(`Perfil "${name}" creado correctamente`);

        //  Pasar el perfil creado al callback
        if (onSuccess && result.data) {
          onSuccess(result.data);
        }

        resetForm();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Error al crear perfil",
        );
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="size-4" />
          Nuevo Perfil
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Crear perfil de voz</DialogTitle>
            <DialogDescription>
              Sube un archivo de audio y el texto de referencia para clonar la
              voz.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del narrador</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Juan Pérez"
                disabled={isPending}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ref-text">Texto de referencia</Label>
              <Textarea
                id="ref-text"
                value={refText}
                onChange={(e) => setRefText(e.target.value)}
                placeholder="Escribe el texto que se usará para clonar la voz..."
                rows={4}
                disabled={isPending}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Idioma</Label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isPending}
              >
                <option value="Spanish">Español</option>
                <option value="English">Inglés</option>
                <option value="Portuguese">Portugués</option>
                <option value="French">Francés</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="audio-file">Archivo de audio (mp3, wav)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="audio-file"
                  type="file"
                  accept=".mp3,.wav,.m4a"
                  onChange={handleFileChange}
                  disabled={isPending}
                  className="flex-1"
                />
              </div>
              {audioFileName && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="truncate flex-1">{audioFileName}</span>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="text-destructive hover:text-destructive/80"
                    disabled={isPending}
                  >
                    <X className="size-4" />
                  </button>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Formatos soportados: MP3, WAV, M4A
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                "Crear Perfil"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
