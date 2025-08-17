
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookMarked, CalendarDays, LayoutDashboard, Flower2, LogOut } from "lucide-react";
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
import { useAuth, AuthProvider } from "./auth-provider";
import { signOut } from "@/lib/auth";
import { useMoodStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";


const menuItems = [
  { href: "/log-mood", label: "Log Mood", icon: BookMarked },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/trends", label: "Trends", icon: LayoutDashboard },
];

function AuthArea() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const clearEntries = useMoodStore(state => state.clearEntries);

    const handleSignOut = async () => {
        await signOut();
        clearEntries();
        router.push('/');
    };

    if (loading) {
        return <div className="p-4"><Button className="w-full" disabled>Loading...</Button></div>;
    }

    if (user) {
        const fallback = (user.displayName || user.email || "U")[0].toUpperCase();
        return (
             <div className="flex flex-col gap-2 p-2">
                <div className="flex items-center gap-2 p-2 rounded-md bg-sidebar-accent">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback>{fallback}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-sidebar-accent-foreground truncate">{user.displayName || user.email}</span>
                </div>
                <Button variant="ghost" className="justify-start" onClick={handleSignOut}>
                    <LogOut />
                    <span>Sign Out</span>
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2 p-4">
            <Button asChild><Link href="/login">Login</Link></Button>
            <Button asChild variant="secondary"><Link href="/signup">Sign Up</Link></Button>
        </div>
    );
}

function AppShellContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const { user } = useAuth();

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
            {user && (
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
            )}
        </SidebarContent>
        <SidebarFooter>
            <AuthArea />
        </SidebarFooter>
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
    <AuthProvider>
        <SidebarProvider>
            <AppShellContent>{children}</AppShellContent>
        </SidebarProvider>
    </AuthProvider>
  );
}
