"use client";

import { useEffect, useState } from "react";
import { Plus, User, Users, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { createAudio, createDuetAudio } from "@/app/actions/audio.actions";
import { getProfiles, type Profile } from "@/app/actions/profile.actions";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

interface CreateAudioDialogProps {
  onSuccess?: () => void;
}

type GenerationMode = "single" | "duet";

export function CreateAudioDialog({ onSuccess }: CreateAudioDialogProps) {
  const [open, setOpen] = useState(false);

  const [text, setText] = useState("");
  const [mode, setMode] = useState<GenerationMode>("duet");

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [hasLoadedProfiles, setHasLoadedProfiles] = useState(false);

  const [profileAId, setProfileAId] = useState("");
  const [profileBId, setProfileBId] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(false);

  // Efecto solo para cargar perfiles cuando se abre el diálogo
  useEffect(() => {
    let mounted = true;

    if (!open) {
      return () => {
        mounted = false;
      };
    }

    const loadProfiles = async () => {
      setIsLoadingProfiles(true);
      setHasLoadedProfiles(false);

      try {
        const result = await getProfiles();

        if (!mounted) return;

        if (!result.success || !result.data) {
          toast.error(result.error || "Error al cargar perfiles");
          return;
        }

        const activeProfiles = result.data.items.filter(
          (profile: Profile) => profile.active,
        );

        setProfiles(activeProfiles);

        if (activeProfiles.length > 0) {
          setProfileAId(activeProfiles[0].id.toString());

          if (activeProfiles.length > 1) {
            setProfileBId(activeProfiles[1].id.toString());
          }
        }

        setHasLoadedProfiles(true);
      } catch {
        toast.error("Error al cargar perfiles");
      } finally {
        if (mounted) {
          setIsLoadingProfiles(false);
        }
      }
    };

    loadProfiles();

    return () => {
      mounted = false;
    };
  }, [open]);

  // Manejador de cambio de estado del diálogo
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      // Limpiar estados al cerrar el diálogo
      setProfiles([]);
      setProfileAId("");
      setProfileBId("");
      setHasLoadedProfiles(false);
      setText("");
    }
    setOpen(isOpen);
  };

  const handleModeChange = (newMode: GenerationMode) => {
    setMode(newMode);

    if (profiles.length > 0) {
      setProfileAId(profiles[0].id.toString());

      if (profiles.length > 1) {
        setProfileBId(profiles[1].id.toString());
      }
    }
  };

  const handleProfileAChange = (value: string) => {
    setProfileAId(value);

    if (value === profileBId) {
      const alternative = profiles.find((p) => p.id.toString() !== value);

      setProfileBId(alternative?.id.toString() ?? "");
    }
  };

  const handleProfileBChange = (value: string) => {
    setProfileBId(value);

    if (value === profileAId) {
      const alternative = profiles.find((p) => p.id.toString() !== value);

      setProfileAId(alternative?.id.toString() ?? "");
    }
  };

  const resetForm = () => {
    setText("");
    setProfileAId("");
    setProfileBId("");
    setOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!text.trim()) {
      toast.error("Escribe un texto");
      return;
    }

    if (mode === "single" && !profileAId) {
      toast.error("Selecciona una voz");
      return;
    }

    if (
      mode === "duet" &&
      (!profileAId || !profileBId || profileAId === profileBId)
    ) {
      toast.error("Selecciona dos perfiles diferentes");
      return;
    }

    setIsLoading(true);

    try {
      const result =
        mode === "single"
          ? await createAudio(parseInt(profileAId, 10), text)
          : await createDuetAudio(
              parseInt(profileAId, 10),
              parseInt(profileBId, 10),
              text,
            );

      if (!result.success) {
        toast.error(result.error || "Error al generar audio");
        return;
      }

      toast.success(
        mode === "single"
          ? "Audio generado correctamente"
          : "Dueto generado correctamente",
      );

      resetForm();
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error("Error al generar audio");
    } finally {
      setIsLoading(false);
    }
  };

  const isSubmitDisabled =
    isLoading ||
    !text.trim() ||
    !hasLoadedProfiles ||
    profiles.length === 0 ||
    (mode === "single" && !profileAId) ||
    (mode === "duet" &&
      (!profileAId ||
        !profileBId ||
        profileAId === profileBId ||
        profiles.length < 2));

  const renderContent = () => {
    if (isLoadingProfiles) {
      return (
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Cargando perfiles...</p>
        </div>
      );
    }

    if (profiles.length === 0) {
      return (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">
            No tienes perfiles de voz activos.
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Crea un perfil primero antes de generar audio.
          </p>
        </div>
      );
    }

    return (
      <>
        <Tabs
          value={mode}
          onValueChange={(value) => handleModeChange(value as GenerationMode)}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="duet" className="gap-2">
              <Users className="size-4" />2 Voces
            </TabsTrigger>

            <TabsTrigger value="single" className="gap-2">
              <User className="size-4" />1 Voz
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {mode === "single" ? (
          <div className="space-y-2">
            <label className="text-sm font-medium">Voz</label>

            <Select
              value={profileAId}
              onValueChange={handleProfileAChange}
              disabled={profiles.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una voz" />
              </SelectTrigger>

              <SelectContent>
                {profiles.map((profile) => (
                  <SelectItem key={profile.id} value={profile.id.toString()}>
                    {profile.name} ({profile.language})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-sm font-medium">Voces</label>
            <div className="grid grid-cols-2 gap-3">
              <Select
                value={profileAId}
                onValueChange={handleProfileAChange}
                disabled={profiles.length < 2}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Voz 1" />
                </SelectTrigger>

                <SelectContent>
                  {profiles.map((profile) => (
                    <SelectItem
                      key={profile.id}
                      value={profile.id.toString()}
                      disabled={profile.id.toString() === profileBId}
                    >
                      {profile.name} ({profile.language})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={profileBId}
                onValueChange={handleProfileBChange}
                disabled={profiles.length < 2}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Voz 2" />
                </SelectTrigger>

                <SelectContent>
                  {profiles.map((profile) => (
                    <SelectItem
                      key={profile.id}
                      value={profile.id.toString()}
                      disabled={profile.id.toString() === profileAId}
                    >
                      {profile.name} ({profile.language})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {profiles.length < 2 && (
              <p className="text-xs text-destructive">
                Necesitas al menos 2 perfiles para un dueto
              </p>
            )}
          </div>
        )}

        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          maxLength={1000}
          disabled={isLoading}
          placeholder="Escribe el texto que quieres convertir a voz..."
        />

        <p className="text-right text-xs text-muted-foreground">
          {text.length}/1000
        </p>
      </>
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="size-4" />
          Nuevo
          <span className="hidden lg:inline">Audio</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Crear nuevo audio</DialogTitle>

            <DialogDescription>
              Selecciona el tipo de generación y configura las voces.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">{renderContent()}</div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              disabled={isSubmitDisabled}
              className="min-w-30"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generando...
                </>
              ) : mode === "single" ? (
                "Generar Audio"
              ) : (
                "Generar Dueto"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
