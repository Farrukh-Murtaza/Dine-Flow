// context/toast-context/ToastContext.ts
import { createContext } from "react";

export type ToastType = "success" | "error";

export interface ToastState {
    message: string;
    type: ToastType;
}

export interface ToastApi {
    success: (message: string) => void;
    error: (message: string) => void;
}

export const ToastContext = createContext<ToastApi | null>(null);