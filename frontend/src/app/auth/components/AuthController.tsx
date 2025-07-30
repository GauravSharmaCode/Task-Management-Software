"use client";
import { useEffect, useState } from "react";
import { verifyToken } from "@/core/api";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import LogoutButton from "./LogoutButton";


export default function AuthController() {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showForm, setShowForm] = useState<"login" | "register" | null>(null);

  // Helper to check token and verify with backend
  const checkAuth = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setIsAuthenticated(false);
      setShowForm("login");
      setAuthChecked(true);
      return;
    }
    try {
      await verifyToken();
      setIsAuthenticated(true);
    } catch {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      setShowForm("login");
    } finally {
      setAuthChecked(true);
    }
  };

  // On mount and whenever token changes, check auth
  useEffect(() => {
    checkAuth();
    // Listen for token changes in localStorage (e.g., logout in another tab)
    const onStorage = () => {
      checkAuth();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!authChecked) {
    return <div className="flex items-center justify-center min-h-screen">Checking authentication...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      {showForm === "login" || showForm === "register" ? (
        <h1 className="text-2xl font-bold mb-4">
          {showForm === "login" ? "Login" : "Register"}
        </h1>
      ) : (
        <h1 className="text-2xl font-bold mb-4">Welcome!</h1>
      )}
      {isAuthenticated ? (
        <>
          <div className="text-green-700">You are logged in.</div>
          <LogoutButton onLoggedOut={() => { setIsAuthenticated(false); setShowForm("login"); }} />
        </>
      ) : (
        <>
          {showForm === null && (
            <div className="flex gap-2">
              <button
                className="bg-blue-600 text-white rounded px-4 py-2"
                onClick={() => setShowForm("login")}
              >
                Login
              </button>
              <button
                className="bg-green-600 text-white rounded px-4 py-2"
                onClick={() => setShowForm("register")}
              >
                Register
              </button>
            </div>
          )}
          {showForm === "login" && (
            <>
              <LoginForm />
              <button className="text-blue-600 underline mt-2" onClick={() => setShowForm("register")}>Don't have an account? Register</button>
              <button className="text-gray-500 underline mt-2" onClick={() => setShowForm(null)}>Back</button>
            </>
          )}
          {showForm === "register" && (
            <>
              <RegisterForm />
              <button className="text-blue-600 underline mt-2" onClick={() => setShowForm("login")}>Already have an account? Login</button>
              <button className="text-gray-500 underline mt-2" onClick={() => setShowForm(null)}>Back</button>
            </>
          )}
        </>
      )}
    </div>
  );
}
