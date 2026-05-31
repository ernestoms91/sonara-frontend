"use client";

import dynamic from "next/dynamic";

export const ModeToggle = dynamic(
  () => import("./mode-toggle").then((mod) => ({ default: mod.ModeToggle })),
  { ssr: false },
);
