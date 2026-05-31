"use client";

import dynamic from "next/dynamic";

export const ThemeButtonDynamic = dynamic(
  () => import("./theme-button").then((mod) => ({ default: mod.ThemeButton })),
  { ssr: false },
);
