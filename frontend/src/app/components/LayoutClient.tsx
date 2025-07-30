"use client";
import { usePathname } from "next/navigation";
import AppHeader from "@/app/components/AppHeader";
import NotificationsPanel from "@/app/components/NotificationsPanel";
import AuthGuard from "@/app/components/AuthGuard";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");
  return (
    <>
      {!isAuthPage && <AppHeader />}
      {!isAuthPage && <NotificationsPanel />}
      <AuthGuard>{children}</AuthGuard>
    </>
  );
}
