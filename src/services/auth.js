import { api } from "./apiClient";

export async function login(email, password) {
  const { data } = await api.post("/api/auth/login", { email, password });
  if (data?.token) localStorage.setItem("mcToken", data.token);
  return data;
}
export function logout() { localStorage.removeItem("mcToken"); }
