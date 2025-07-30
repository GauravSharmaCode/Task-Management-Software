"use client";
import LogoutButton from "@/app/auth/components/LogoutButton";

export default function AppHeader() {
  return (
    <header className="w-full flex justify-end p-4">
      <LogoutButton />
    </header>
  );
}
