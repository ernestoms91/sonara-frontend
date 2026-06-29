// components/features/boletines/OrdenarPanel.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, X } from "lucide-react";
import { AudioFromAPI } from "@/types/api";

interface OrdenarPanelProps {
  items: AudioFromAPI[];
  onReorder: (items: AudioFromAPI[]) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export function OrdenarPanel({
  items: initialItems,
  onReorder,
  onClose,
  onConfirm,
}: OrdenarPanelProps) {
  const [items, setItems] = useState(initialItems);

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...items];
    [newItems[index - 1], newItems[index]] = [
      newItems[index],
      newItems[index - 1],
    ];
    setItems(newItems);
    onReorder(newItems);
  };

  const moveDown = (index: number) => {
    if (index === items.length - 1) return;
    const newItems = [...items];
    [newItems[index], newItems[index + 1]] = [
      newItems[index + 1],
      newItems[index],
    ];
    setItems(newItems);
    onReorder(newItems);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed inset-x-0 bottom-0 top-auto max-h-[70vh] bg-background border-t rounded-t-xl shadow-xl animate-in slide-in-from-bottom">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">
            Ordenar informaciones ({items.length}/30)
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="overflow-y-auto h-full p-4 space-y-2">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
            >
              <span className="text-sm font-medium text-primary w-8">
                {index + 1}
              </span>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.title}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {item.profile_name} • {Math.floor(item.duration / 60)}:
                  {(item.duration % 60).toString().padStart(2, "0")}
                </p>
              </div>

              <div className="flex gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => moveDown(index)}
                  disabled={index === items.length - 1}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t">
          <Button onClick={onConfirm} className="w-full">
            Confirmar orden y crear boletín
          </Button>
        </div>
      </div>
    </div>
  );
}
