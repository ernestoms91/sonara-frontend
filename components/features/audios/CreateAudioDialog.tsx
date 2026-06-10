// components/features/audios/CreateAudioDialog.tsx
"use client";

import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { createAudio } from "@/app/actions/audio.actions";
import { getProfiles } from "@/app/actions/profile.actions";

interface Profile {
  id: number;
  name: string;
  language: string;
  active: boolean;
}

interface CreateAudioDialogProps {
  onSuccess?: () => void;
}

export function CreateAudioDialog({ onSuccess }: CreateAudioDialogProps) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [profileId, setProfileId] = useState<string>("");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(true);

  // Cargar perfiles cuando se abre el diálogo
  useEffect(() => {
    if (open) {
      const loadProfiles = async () => {
        setIsLoadingProfiles(true);
        const result = await getProfiles();
        if (result.success && result.profiles) {
          setProfiles(result.profiles);
          // Solo establecer el primer perfil si no hay uno seleccionado
          if (result.profiles.length > 0 && !profileId) {
            setProfileId(result.profiles[0].id.toString());
          }
        } else {
          toast.error(result.error || "Error al cargar perfiles");
        }
        setIsLoadingProfiles(false);
      };
      loadProfiles();
    }
  }, [open, profileId]); // Agregado profileId a dependencias

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profileId) {
      toast.error("Selecciona un perfil de voz");
      return;
    }

    if (!text.trim()) {
      toast.error("Escribe un texto");
      return;
    }

    setIsLoading(true);

    try {
      const result = await createAudio(parseInt(profileId), text);

      if (result.success) {
        toast.success("Audio generado correctamente");
        setText("");
        setProfileId("");
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
      <DialogContent
        className="sm:max-w-md"
        onCloseAutoFocus={(e) => {
          e.preventDefault();
        }}
        onOpenAutoFocus={(e) => {
          e.preventDefault();
        }}
      >
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Crear nuevo audio</DialogTitle>
            <DialogDescription>
              Selecciona una voz y escribe el texto a convertir.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {/* Select de perfiles */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Seleccionar voz</label>
              <Select
                value={profileId}
                onValueChange={(value) => {
                  console.log("Valor seleccionado:", value); // Para debug
                  setProfileId(value);
                }}
                disabled={isLoadingProfiles || profiles.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una voz" />
                </SelectTrigger>
                <SelectContent position="popper" side="bottom">
                  {isLoadingProfiles ? (
                    <SelectItem value="loading" disabled>
                      Cargando voces...
                    </SelectItem>
                  ) : profiles.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No hay voces disponibles
                    </SelectItem>
                  ) : (
                    profiles.map((profile) => (
                      <SelectItem
                        key={profile.id}
                        value={profile.id.toString()}
                      >
                        {profile.name} ({profile.language})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {profiles.length === 0 && !isLoadingProfiles && (
                <p className="text-xs text-destructive">
                  No tienes perfiles de voz. Crea uno primero.
                </p>
              )}
            </div>

            {/* Textarea para el texto */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Texto</label>
              <Textarea
                placeholder="Escribe el texto que quieres convertir a voz..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={5}
                className="resize-none"
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground text-right">
                {text.length} / 1000 caracteres
              </p>
            </div>
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
            <Button
              type="submit"
              disabled={
                isLoading || !profileId || !text.trim() || profiles.length === 0
              }
            >
              {isLoading ? "Generando..." : "Generar Audio"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
