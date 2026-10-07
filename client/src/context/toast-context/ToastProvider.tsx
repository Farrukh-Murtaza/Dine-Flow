// context/toast-context/ToastProvider.tsx
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Toast } from "../../components/ui";
import { ToastContext, type ToastApi, type ToastState, type ToastType } from "./ToastContext";

const TOAST_DURATION_MS = 2600;

export default function ToastProvider({ children }: { children: ReactNode }) {
    const [toast, setToast] = useState<ToastState | null>(null);
    const timer = useRef<number | undefined>(undefined);

    const show = useCallback((message: string, type: ToastType) => {
        window.clearTimeout(timer.current);
        setToast({ message, type });
        timer.current = window.setTimeout(() => setToast(null), TOAST_DURATION_MS);
    }, []);

    // clear the pending timeout on unmount
    useEffect(() => () => window.clearTimeout(timer.current), []);

    const api = useMemo<ToastApi>(
        () => ({
            success: (message) => show(message, "success"),
            error: (message) => show(message, "error"),
        }),
        [show],
    );

    return (
        <ToastContext.Provider value={api}>
            {children}
            <Toast toast={toast} />
        </ToastContext.Provider>
    );
}