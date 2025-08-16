"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookMarked, CalendarDays, LayoutDashboard, Flower2 } from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";

const menuItems = [
  { href: "/", label: "Log Mood", icon: BookMarked },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/trends", label: "Trends", icon: LayoutDashboard },
];

function AppShellContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  const handleLinkClick = () => {
    setOpenMobile(false);
  };

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <Button variant="ghost" size="icon" className="text-primary" asChild>
              <Link href="/">
                <Flower2 className="h-6 w-6" />
              </Link>
            </Button>
            <h1 className="text-xl font-semibold">Mood Bloom</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  className="w-full justify-start"
                  tooltip={item.label}
                  onClick={handleLinkClick}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter/>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:h-16 md:px-6">
          <SidebarTrigger className="md:hidden"/>
          <div className="flex-1">
             {/* Can add breadcrumbs or page title here */}
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
        </main>
      </SidebarInset>
    </>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppShellContent>{children}</AppShellContent>
    </SidebarProvider>
  );
}
