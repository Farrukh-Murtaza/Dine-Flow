import { X } from "lucide-react";
import { useEffect } from "react";


interface ModalProps {
    title: string,
    onClose: () => void,
    children: React.ReactNode
}


export function Modal({ title, onClose, children }: ModalProps) {
    useEffect(() => {
        const onKey = (event: { key: string; }) => event.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-xl">
                <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-lg font-bold">{title}</h3>
                    <button onClick={onClose} aria-label="Close">
                        <X size={18} className="text-muted-foreground" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}