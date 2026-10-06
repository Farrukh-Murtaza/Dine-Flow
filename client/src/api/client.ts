import axios, { AxiosError, type AxiosRequestConfig } from "axios";

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

client.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// No unwrapping here: just handle expired tokens
client.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const isLogin = error.config?.url?.includes("/auth/login");
    if (error.response?.status === 401 && !isLogin) {
      clearToken();
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
    }
    return Promise.reject(error);
  },
);

// Typed helpers: each one returns the response body as T, not AxiosResponse<T>
export const http = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    client.get<T>(url, config).then((res) => res.data),
  post: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    client.post<T>(url, body, config).then((res) => res.data),
  put: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    client.put<T>(url, body, config).then((res) => res.data),
  patch: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    client.patch<T>(url, body, config).then((res) => res.data),
};

export function getErrorMessage(error: unknown, fallback = "Something went wrong"): string {
  if (axios.isAxiosError(error)) {
    const message = (error.response?.data as { message?: string } | undefined)?.message;
    if (message) return message;
    if (error.code === "ERR_NETWORK") return "Cannot reach the server";
    if (error.code === "ECONNABORTED") return "The request timed out";
  }
  return error instanceof Error ? error.message : fallback;
}

export default client;