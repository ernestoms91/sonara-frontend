// components/features/boletines/OrdenarBoletinesModal.tsx
"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { AudioFromAPI } from "@/types/audio";
import { SortableItem } from "./SortableItem";

interface OrdenarBoletinesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedBoletines: AudioFromAPI[];
  onConfirm: (orderedIds: string[], startTime: string) => Promise<void>;
}

export function OrdenarBoletinesModal({
  open,
  onOpenChange,
  selectedBoletines,
  onConfirm,
}: OrdenarBoletinesModalProps) {
  const [items, setItems] = useState<AudioFromAPI[]>(selectedBoletines);
  const [startTime, setStartTime] = useState<Date>(() => {
    const now = new Date();
    const minutes = now.getMinutes();
    const normalizedMinutes = minutes < 30 ? 0 : 30;
    const date = new Date(now);
    date.setMinutes(normalizedMinutes);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  });
  const [errors, setErrors] = useState<{
    fecha?: string;
    items?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Ajustar minutos a 00 o 30
  const normalizeMinutes = (date: Date): Date => {
    const minutes = date.getMinutes();
    const normalizedMinutes = minutes < 30 ? 0 : 30;
    const newDate = new Date(date);
    newDate.setMinutes(normalizedMinutes);
    newDate.setSeconds(0);
    newDate.setMilliseconds(0);
    return newDate;
  };

  // Validar si el formulario es válido para habilitar el botón
  const isFormValid = (): boolean => {
    if (items.length !== 30) return false;
    if (!startTime || isNaN(startTime.getTime())) return false;
    return true;
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setItems(selectedBoletines);
      const now = new Date();
      const normalizedNow = normalizeMinutes(now);
      setStartTime(normalizedNow);
      setErrors({});
      setIsSubmitting(false);
    }
    onOpenChange(newOpen);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over?.id);
      setItems(arrayMove(items, oldIndex, newIndex));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { fecha?: string; items?: string } = {};

    if (items.length !== 30) {
      newErrors.items = `Debes seleccionar exactamente 30 informaciones. Actualmente tienes ${items.length}`;
    }

    if (!startTime || isNaN(startTime.getTime())) {
      newErrors.fecha = "Debes seleccionar una fecha válida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getHour12 = (date: Date) => {
    const hour = date.getHours();
    const hour12 = hour % 12 || 12;
    return hour12.toString();
  };

  const getMinuteValue = (date: Date) => {
    const minutes = date.getMinutes();
    return minutes === 0 ? "00" : "30";
  };

  const getAmPm = (date: Date) => {
    return date.getHours() >= 12 ? "PM" : "AM";
  };

  const updateHour12 = (hour12: string) => {
    const currentAmPm = getAmPm(startTime);
    let newHour24 = parseInt(hour12);

    if (currentAmPm === "PM" && newHour24 !== 12) {
      newHour24 += 12;
    } else if (currentAmPm === "AM" && newHour24 === 12) {
      newHour24 = 0;
    }

    const newDate = new Date(startTime);
    newDate.setHours(newHour24);
    setStartTime(normalizeMinutes(newDate));
    if (errors.fecha) setErrors({ ...errors, fecha: undefined });
  };

  const updateMinute = (minute: string) => {
    const newDate = new Date(startTime);
    newDate.setMinutes(parseInt(minute));
    newDate.setSeconds(0);
    newDate.setMilliseconds(0);
    setStartTime(newDate);
    if (errors.fecha) setErrors({ ...errors, fecha: undefined });
  };

  const updateAmPm = (ampm: string) => {
    const currentHour24 = startTime.getHours();
    let newHour24 = currentHour24;

    if (ampm === "PM" && currentHour24 < 12) {
      newHour24 += 12;
    } else if (ampm === "AM" && currentHour24 >= 12) {
      newHour24 -= 12;
    }

    const newDate = new Date(startTime);
    newDate.setHours(newHour24);
    setStartTime(normalizeMinutes(newDate));
    if (errors.fecha) setErrors({ ...errors, fecha: undefined });
  };

  const handleConfirm = async () => {
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const ids = items.map((item) => item.audio_id);
      const finalDate = normalizeMinutes(new Date(startTime));

      const year = finalDate.getFullYear();
      const month = String(finalDate.getMonth() + 1).padStart(2, "0");
      const day = String(finalDate.getDate()).padStart(2, "0");
      const hours = String(finalDate.getHours()).padStart(2, "0");
      const minutes = String(finalDate.getMinutes()).padStart(2, "0");
      const seconds = String(finalDate.getSeconds()).padStart(2, "0");

      const localDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

      console.log("🔴 Hora local a enviar:", localDateTime);

      await onConfirm(ids, localDateTime);
    } finally {
      setIsSubmitting(false);
    }
  };

  const hourOptions = [
    "12",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
  ];
  const minuteOptions = ["00", "30"];
  const ampmOptions = ["AM", "PM"];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col sm:max-w-[95vw]">
        <DialogHeader>
          <DialogTitle>Ordenar {items.length} informaciones</DialogTitle>
          <DialogDescription>
            Arrastra las tarjetas para reordenarlas. Selecciona fecha y hora
            (cada 30 minutos).
          </DialogDescription>
        </DialogHeader>

        {/* Selector de fecha y hora */}
        <div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/30 rounded-lg border">
          <div className="flex-1">
            <Label className="text-sm font-medium mb-2 block">
              Fecha de publicación <span className="text-destructive">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startTime && "text-muted-foreground",
                    errors.fecha && "border-destructive ring-destructive/20",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startTime
                    ? format(startTime, "PPP", { locale: es })
                    : "Seleccionar fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-popover border-border">
                <Calendar
                  mode="single"
                  selected={startTime}
                  onSelect={(date) => {
                    if (date) {
                      const newDate = new Date(date);
                      setStartTime(normalizeMinutes(newDate));
                    }
                    if (errors.fecha)
                      setErrors({ ...errors, fecha: undefined });
                  }}
                  locale={es}
                />
              </PopoverContent>
            </Popover>
            {errors.fecha && (
              <p className="text-xs text-destructive mt-1">{errors.fecha}</p>
            )}
          </div>

          <div className="flex-1">
            <Label className="text-sm font-medium mb-2 block">
              Hora de publicación <span className="text-destructive">*</span>
            </Label>
            <div className="flex gap-2">
              <Select value={getHour12(startTime)} onValueChange={updateHour12}>
                <SelectTrigger className="w-17.5 bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover" position="popper">
                  {hourOptions.map((hour) => (
                    <SelectItem key={hour} value={hour}>
                      {hour}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={getMinuteValue(startTime)}
                onValueChange={updateMinute}
              >
                <SelectTrigger className="w-17.5 bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover" position="popper">
                  {minuteOptions.map((minute) => (
                    <SelectItem key={minute} value={minute}>
                      {minute}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={getAmPm(startTime)} onValueChange={updateAmPm}>
                <SelectTrigger className="w-17.5 bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover" position="popper">
                  {ampmOptions.map((ampm) => (
                    <SelectItem key={ampm} value={ampm}>
                      {ampm}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {errors.items && (
          <div className="px-4">
            <p className="text-xs text-destructive">{errors.items}</p>
          </div>
        )}

        <div className="flex-1 overflow-y-auto overflow-x-hidden my-4 px-1">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {items.map((item, index) => (
                  <SortableItem key={item.id} item={item} index={index} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        <div className="text-xs text-muted-foreground text-center py-2">
          Hora seleccionada: {format(startTime, "hh:mm a")}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!isFormValid() || isSubmitting}
            className="min-w-40"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando boletín...
              </>
            ) : (
              `Crear boletín (${items.length}/30)`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
