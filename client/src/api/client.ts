import axios from "axios";

const TOKEN_KEY = "dineflow_token";
export const AUTH_EXPIRED_EVENT = "dineflow:auth-expired";

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);
export const setToken = (token: string): void => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = (): void => localStorage.removeItem(TOKEN_KEY);

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Attach the JWT to every request
client.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Unwrap data, and sign the user out when the token is rejected
client.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const isLogin = error.config?.url?.includes("/auth/login");
    if (error.response?.status === 401 && !isLogin) {
      clearToken();
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
    }
    return Promise.reject(error);
  },
);

export function getErrorMessage(error: unknown, fallback = "Something went wrong"): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string" && message) return message;
    if (error.code === "ERR_NETWORK") return "Cannot reach the server";
    if (error.code === "ECONNABORTED") return "The request timed out";
  }
  return error instanceof Error ? error.message || fallback : fallback;
}

export default client;
