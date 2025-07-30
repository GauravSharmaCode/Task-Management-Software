
import axios from "axios";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  // withCredentials: true, // Removed for token-based auth (no cookies)
});


// Axios interceptors for logging and token injection
api.interceptors.request.use(
  (config) => {
    // Attach token except for login and register
    const noAuthRoutes = ["/auth/login/", "/auth/register/"];
    let urlPath = "";
    try {
      // Always resolve the full URL to get the pathname
      const urlObj = new URL(config.url!, config.baseURL || window.location.origin);
      urlPath = urlObj.pathname;
    } catch {
      urlPath = config.url || "";
    }
    // Ensure path always starts with /api for backend match
    const isNoAuth = noAuthRoutes.includes(urlPath);
    if (!isNoAuth) {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (token) {
        config.headers = config.headers || {};
        config.headers["Authorization"] = `Token ${token}`;
      }
    }
    console.log(`[API REQUEST] ${config.method?.toUpperCase()} ${config.url}`, config);
    return config;
  },
  (error) => {
    console.error("[API REQUEST ERROR]", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`[API RESPONSE] ${response.config.url}`, response);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`[API RESPONSE ERROR] ${error.response.config.url}`, error.response);
      if (error.response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          // Prevent infinite redirect loop if already on /auth
          if (!window.location.pathname.startsWith("/auth")) {
            window.location.href = "/auth";
          }
        }
      }
    } else {
      console.error("[API RESPONSE ERROR]", error);
    }
    return Promise.reject(error);
  }
);

// Helper to wrap API calls with error handling
export async function safeApiCall<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    // Optionally, show a toast or notification here
    return null;
  }
}

// =====================
// AUTHENTICATION APIS
// =====================
export const login = (data: { username: string; password: string }) =>
  api.post("/auth/login/", data);

export const logout = () =>
  api.post("/auth/logout/");

export const verifyToken = () =>
  api.get("/auth/verify/");

export const register = (data: { username: string; email: string; password: string }) =>
  api.post("/auth/register/", data);

// =====================
// TASKS APIS
// =====================
export interface TaskFilters {
  due_date?: string;
  priority?: "low" | "medium" | "high";
  status?: "todo" | "in_progress" | "completed";
  assigned_user?: number;
}

export const getTasks = (filters?: TaskFilters) =>
  api.get("/tasks/", { params: filters });

export const createTask = (data: any) =>
  api.post("/tasks/", data);

export const getTask = (id: number | string) =>
  api.get(`/tasks/${id}/`);

export const updateTask = (id: number | string, data: any) =>
  api.put(`/tasks/${id}/`, data);

export const deleteTask = (id: number | string) =>
  api.delete(`/tasks/${id}/`);

// =====================
// NOTIFICATIONS APIS
// =====================
export const getNotifications = () =>
  api.get("/notifications/");
