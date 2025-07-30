"use client";
import { useRouter } from "next/navigation";

export default function LoginRegisterButton() {
  const router = useRouter();
  return (
    <div className="flex gap-2">
      <button
        className="bg-blue-600 text-white rounded px-4 py-2"
        onClick={() => router.push("/auth")}
      >
        Login
      </button>
      <button
        className="bg-green-600 text-white rounded px-4 py-2"
        onClick={() => router.push("/auth/register")}
      >
        Register
      </button>
    </div>
  );
}
