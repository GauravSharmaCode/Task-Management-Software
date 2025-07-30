import { login, logout, verifyToken } from "@/core/api";

export async function loginUser(username: string, password: string) {
  const response = await login({ username, password });
  // Save token to localStorage or cookie as needed
  // localStorage.setItem("token", response.data.token);
  return response.data;
}

export async function logoutUser() {
  await logout();
  // localStorage.removeItem("token");
}

export async function checkAuth() {
  try {
    await verifyToken();
    return true;
  } catch {
    return false;
  }
}
