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
    return pathname.startsWith("/user/boletin"); // ✅ Corregido
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
    return pathname.startsWith("/user/boletin"); // ✅ Corregido
  };

  const handleLogout = () => {
    startLogoutTransition(async () => {
      await logoutAction();
    });
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border px-4 py-5 lg:py-6">
        <div className="flex items-center justify-between">
          <Link
            href="/user/audios"
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

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setIsBoletinesOpen(!isBoletinesOpen)}
              isActive={isBoletinesActive()}
              className="px-3 py-2 text-sm lg:px-4 lg:py-2.5 lg:text-base"
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-3 lg:gap-4">
                  <Newspaper className="size-5 shrink-0" />
                  <span className="truncate font-medium">Boletines</span>
                </div>
                {isBoletinesOpen ? (
                  <ChevronDown className="size-4 shrink-0" />
                ) : (
                  <ChevronRight className="size-4 shrink-0" />
                )}
              </div>
            </SidebarMenuButton>

            {isBoletinesOpen && (
              <SidebarMenuSub>
                {boletinesGroup.subItems.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.title}>
                    <SidebarMenuSubButton
                      asChild
                      isActive={pathname === subItem.url}
                      className="pl-11 lg:pl-12"
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

          {isAdmin && (
            <>
              <div className="my-2 border-t border-border" />

              {adminItems.map((item) => (
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
            </>
          )}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4 lg:p-5">
        <div className="flex items-center gap-3 overflow-hidden lg:gap-4">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary lg:size-10 lg:text-sm">
            {initials}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground lg:text-base">
              {displayName}
            </p>
            <p className="truncate text-xs text-muted-foreground lg:text-sm">
              {displayPlan}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            aria-label="Cerrar sesión"
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 lg:p-2.5"
          >
            {isLoggingOut ? (
              <div className="size-4 lg:size-5 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
            ) : (
              <LogOut className="size-4 lg:size-5" />
            )}
          </button>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
