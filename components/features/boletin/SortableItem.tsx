// components/features/boletines/SortableItem.tsx
"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { AudioFromAPI } from "@/types/audio";

interface SortableItemProps {
  item: AudioFromAPI;
  index: number;
}

export function SortableItem({ item, index }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg border hover:bg-muted transition-all"
    >
      <div className="shrink-0 flex flex-col items-center gap-1 min-w-[48px]">
        <span className="text-sm font-medium text-primary w-8 text-center">
          {index + 1}
        </span>
        {/* Esta es el área que usas para arrastrar */}
        <div {...attributes} {...listeners}>
          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab active:cursor-grabbing" />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium break-words whitespace-normal">
          {item.title}
        </p>
        <p className="text-xs text-muted-foreground mt-1 break-words whitespace-normal">
          {item.profile_name} • {Math.floor(item.duration / 60)}:
          {(item.duration % 60).toString().padStart(2, "0")}
        </p>
        <p className="text-xs text-muted-foreground/70 mt-2 line-clamp-2 break-words whitespace-normal">
          {item.text}
        </p>
      </div>
    </div>
  );
}
