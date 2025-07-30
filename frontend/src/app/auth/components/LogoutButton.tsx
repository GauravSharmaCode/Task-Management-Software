"use client";
import { logout } from "@/core/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/core/AuthContext";

export default function LogoutButton({ onLoggedOut }: { onLoggedOut?: () => void } = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { clearAuth } = useAuth();



  const handleLogout = async () => {
    setLoading(true);
    setError("");
    let apiFailed = false;
    try {
      await logout();
    } catch (err: any) {
      apiFailed = true;
      setError("Logout failed (server unreachable, logging out locally)");
    } finally {
      clearAuth();
      if (onLoggedOut) {
        console.log("LogoutButton: onLoggedOut called");
        onLoggedOut();
      } else {
        router.push("/auth");
      }
      setLoading(false);
    }
  };

  return (
    <button onClick={handleLogout} className="bg-gray-600 text-white rounded px-4 py-2" disabled={loading}>
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}

