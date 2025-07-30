"use client";
import LogoutButton from "@/app/auth/components/LogoutButton";
import NotificationBell from "../notifications/components/NotificationBell";
import { useAuth } from "@/core/AuthContext";

export default function AppHeader() {
  const { user } = useAuth();

  return (
    <header className="w-full flex justify-between items-center p-4">
      <h1 className="text-xl font-bold">Task Management</h1>
      <div className="flex items-center space-x-4">
        <NotificationBell userId={user?.id || null} />
        <LogoutButton />
      </div>
    </header>
  );
}
