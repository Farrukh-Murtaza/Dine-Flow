// context/toast-context/useToast.ts
import { useContext } from "react";
import { ToastContext, type ToastApi } from "./ToastContext";

export function useToast(): ToastApi {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
    return ctx;
}