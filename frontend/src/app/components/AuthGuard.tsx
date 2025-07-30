"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Helper to check token and redirect if needed
  const checkAuth = () => {
    if (typeof window === "undefined") return;
    if (pathname.startsWith("/auth")) return;
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/auth");
    }
  };

  useEffect(() => {
    checkAuth();
    const onStorage = () => {
      checkAuth();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, router]);

  return <>{children}</>;
}
