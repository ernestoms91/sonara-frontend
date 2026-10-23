// components/common/AppSidebar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useTransition } from "react";

import type { LucideIcon } from "lucide-react";
import {
  AudioLines,
  Newspaper,
  LogOut,
  ChevronDown,
  ChevronRight,
  Users,
  UserCog,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { ThemeButtonDynamic } from "./theme-button-dynamic";
import { logoutAction } from "@/app/actions/auth.actions";

interface UserData {
  id: number;
  username: string;
  email: string;
  full_name: string;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

interface SubNavItem {
  title: string;
  url: string;
}

interface NavGroup {
  title: string;
  icon: LucideIcon;
  subItems: SubNavItem[];
}

interface AppSidebarProps {
  user?: UserData | null;
}

const navItems: NavItem[] = [
  {
    title: "Audios",
    url: "/user/audios",
    icon: AudioLines,
  },
];

const boletinesGroup: NavGroup = {
  title: "Boletines",
  icon: Newspaper,
  subItems: [
    {
      title: "Crear boletín",
      url: "/user/boletin/crear",
    },
    {
      title: "Listar boletines",
      url: "/user/boletin/listar",
    },
  ],
};

const adminItems: NavItem[] = [
  {
    title: "Perfiles",
    url: "/user/profiles",
    icon: Users,
  },
  {
    title: "Usuarios",
    url: "/user/users",
    icon: UserCog,
  },
];

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();
  const [isBoletinesOpen, setIsBoletinesOpen] = useState(() => {
    return pathname.startsWith("/user/boletin");
  });
  const [isLoggingOut, startLogoutTransition] = useTransition();

  const isAdmin = user?.is_admin === true;

  const displayName = user?.full_name || "Usuario";
  const displayPlan = isAdmin ? "Administrador" : "Editor";

  const initials = displayName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const isItemActive = (url: string) => {
    return pathname === url;
  };

  const isBoletinesActive = () => {
    return pathname.startsWith("/user/boletin");
  };

  const handleLogout = () => {
    startLogoutTransition(async () => {
      await logoutAction();
    });
  };

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-5 group-data-[collapsible=icon]:px-2 lg:py-6">
        <div className="flex items-center justify-between gap-2 group-data-[collapsible=icon]:justify-center">
          <Link
            href="/user/audios"
            className="group flex items-center gap-2.5 transition-opacity hover:opacity-80"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-sidebar-border bg-card shadow-sm">
              <Image
                src="/screen.png"
                alt="Sonara"
                width={28}
                height={28}
                priority
                className="size-6 w-auto dark:invert"
              />
            </span>
            <span className="text-lg font-semibold tracking-tight text-foreground group-data-[collapsible=icon]:hidden">
              Sonara
            </span>
          </Link>

          <div className="group-data-[collapsible=icon]:hidden">
            <ThemeButtonDynamic />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-0 overflow-x-hidden px-2 py-4 lg:py-5">
        <div className="pb-5">
          <p className="px-3 pb-2 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground/70 group-data-[collapsible=icon]:hidden">
            Contenido
          </p>

          <SidebarMenu className="gap-1">
            {navItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isItemActive(item.url)}
                  tooltip={item.title}
                  className="h-9 px-3 text-sm"
                >
                  <Link href={item.url} className="flex items-center gap-3">
                    <item.icon className="size-4.5 shrink-0" />
                    <span className="truncate font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}

            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setIsBoletinesOpen(!isBoletinesOpen)}
                isActive={isBoletinesActive()}
                tooltip="Boletines"
                className="h-9 px-3 text-sm"
              >
                <Newspaper className="size-4.5 shrink-0" />
                <span className="flex-1 truncate text-left font-medium">
                  Boletines
                </span>
                <span className="group-data-[collapsible=icon]:hidden">
                  {isBoletinesOpen ? (
                    <ChevronDown className="size-4" />
                  ) : (
                    <ChevronRight className="size-4" />
                  )}
                </span>
              </SidebarMenuButton>

              {isBoletinesOpen && (
                <SidebarMenuSub className="my-1 gap-0.5 py-1">
                  {boletinesGroup.subItems.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={pathname === subItem.url}
                        className="h-8 pl-3"
                      >
                        <Link href={subItem.url}>
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </div>

        {isAdmin && (
          <div className="border-t border-sidebar-border pt-4">
            <p className="px-3 pb-2 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground/70 group-data-[collapsible=icon]:hidden">
              Administración
            </p>

            <SidebarMenu className="gap-1">
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isItemActive(item.url)}
                    tooltip={item.title}
                    className="h-9 px-3 text-sm"
                  >
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon className="size-4.5 shrink-0" />
                      <span className="truncate font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </div>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3 group-data-[collapsible=icon]:p-2 lg:p-4">
        <div className="flex items-center gap-3 overflow-hidden group-data-[collapsible=icon]:justify-center">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary ring-1 ring-primary/20">
            {initials}
          </div>

          <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-medium text-foreground">
              {displayName}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {displayPlan}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-50 group-data-[collapsible=icon]:hidden"
          >
            {isLoggingOut ? (
              <div className="size-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
            ) : (
              <LogOut className="size-4" />
            )}
          </button>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
