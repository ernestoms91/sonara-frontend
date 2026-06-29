// components/features/boletines/SortableItem.tsx
"use client";

import { AudioFromAPI } from "@/types/api";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

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
      <div className="shrink-0 flex flex-col items-center gap-1 min-w-12">
        <span className="text-sm font-medium text-primary w-8 text-center">
          {index + 1}
        </span>
        {/* Esta es el área que usas para arrastrar */}
        <div {...attributes} {...listeners}>
          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab active:cursor-grabbing" />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium wrap-break-word whitespace-normal">
          {item.title}
        </p>
        <p className="text-xs text-primary mt-1 wrap-break-word whitespace-normal">
          {item.profile_name}{" "}
          {item.secondary_profile_name && `- ${item.secondary_profile_name}`}
        </p>
        <p className="text-xs text-muted-foreground/70 mt-2 line-clamp-2 wrap-break-word whitespace-normal">
          {item.text}
        </p>
      </div>
    </div>
  );
}
