"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/core/api";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await login({ username, password });
      if (res.data && res.data.token) {
        localStorage.setItem("token", res.data.token);
        router.push("/tasks");
      } else {
        setError("No token received");
      }
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-xs">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        className="border rounded px-3 py-2"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="border rounded px-3 py-2"
        required
      />
      <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
      {error && <div className="text-red-600 text-sm">{error}</div>}
    </form>
  );
}
