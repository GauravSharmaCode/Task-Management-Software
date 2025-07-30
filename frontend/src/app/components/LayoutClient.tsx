"use client";
import { usePathname } from "next/navigation";
import AppHeader from "@/app/components/AppHeader";
import AuthGuard from "@/app/components/AuthGuard";
import { AuthProvider } from "@/core/AuthContext";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");
  return (
    <AuthProvider>
      {!isAuthPage && <AppHeader />}
      <AuthGuard>{children}</AuthGuard>
    </AuthProvider>
  );
}
