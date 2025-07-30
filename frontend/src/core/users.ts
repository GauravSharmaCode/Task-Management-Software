import { api } from "@/core/api";

export const getUsers = () => api.get("/auth/users/");
