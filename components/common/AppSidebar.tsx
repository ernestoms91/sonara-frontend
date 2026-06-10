"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import type { LucideIcon } from "lucide-react";
import { AudioLines, Mic2, Newspaper, LogOut } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ThemeButtonDynamic } from "./theme-button-dynamic";

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

interface AppSidebarProps {
  user?: {
    name: string;
    plan: string;
  };
}

const navItems: NavItem[] = [
  {
    title: "Audios",
    url: "/user/audios",
    icon: AudioLines,
  },
  {
    title: "Boletines",
    url: "/user/boletines",
    icon: Newspaper,
  },
];

export function AppSidebar({
  user = {
    name: "Juan Designer",
    plan: "Plan Premium",
  },
}: AppSidebarProps) {
  const pathname = usePathname();

  const initials = user.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const isItemActive = (url: string) => {
    return pathname === url || pathname.startsWith(`${url}/`);
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border px-4 py-5 lg:py-6">
        <div className="flex items-center justify-between">
          <Link
            href="/user"
            className="group flex items-center gap-2 transition-opacity hover:opacity-80 lg:gap-3"
          >
            <Image
              src="/screen.png"
              alt="Sonara Logo"
              width={32}
              height={32}
              priority
              className="h-9 w-auto dark:invert lg:h-10"
            />
            <span className="text-xl font-bold tracking-tight text-primary lg:text-2xl">
              Sonara
            </span>
          </Link>

          <ThemeButtonDynamic />
        </div>
      </SidebarHeader>

      <SidebarContent className="py-4 lg:py-6">
        <SidebarMenu className="space-y-1 lg:space-y-2">
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={isItemActive(item.url)}
                tooltip={item.title}
                className="px-3 py-2 text-sm lg:px-4 lg:py-2.5 lg:text-base"
              >
                <Link
                  href={item.url}
                  className="flex items-center gap-3 lg:gap-4"
                >
                  <item.icon className="size-5 shrink-0" />
                  <span className="truncate font-medium">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4 lg:p-5">
        <div className="flex items-center gap-3 overflow-hidden lg:gap-4">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary lg:size-10 lg:text-sm">
            {initials}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground lg:text-base">
              {user.name}
            </p>
            <p className="truncate text-xs text-muted-foreground lg:text-sm">
              {user.plan}
            </p>
          </div>

          <button
            type="button"
            aria-label="Cerrar sesión"
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 lg:p-2.5"
          >
            <LogOut className="size-4 lg:size-5" />
          </button>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
