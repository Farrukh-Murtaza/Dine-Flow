import React from "react";
import { NavLink } from "react-router-dom";
import { AlertCircle, CheckCircle2, Loader2, type LucideIcon } from "lucide-react";

export function NavItem({ icon: IconComponent, label, to, onClick, badge }: { icon: LucideIcon, label: string, to: string, onClick: () => void, badge: string }) {
    const base =
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition";

    const content = (
        <>
            <IconComponent size={18} />
            <span className="flex-1 text-left">{label}</span>
            {badge ? (
                <span className="bg-danger text-primary-foreground text-[10px] px-2 py-0.5 rounded-full">
                    {badge}
                </span>
            ) : null}
        </>
    );

    if (to) {
        return (
            <NavLink
                to={to}
                onClick={onClick}
                className={({ isActive }) =>
                    `${base} ${isActive ? "bg-sidebar-foreground text-sidebar shadow" : "text-sidebar-muted hover:bg-sidebar-foreground/10"}`
                }
            >
                {content}
            </NavLink>
        );
    }

    return (
        <button onClick={onClick} className={`${base} text-sidebar-muted hover:bg-sidebar-foreground/10`}>
            {content}
        </button>
    );
}

interface CardProps { children: React.ReactNode; className?: string }

export function Card({ children, className = "" }: CardProps) {
    return (
        <div className={`bg-surface rounded-2xl border border-border shadow-sm ${className}`}>
            {children}
        </div>
    );
}

const tones = {
    blue: "bg-info-bg text-info",
    green: "bg-success-bg text-success",
    amber: "bg-warning-bg text-warning",
    purple: "bg-surface-muted text-primary",
} as const;

type Tone = keyof typeof tones;

export function Stat({ icon: Icon, label, value, tone = "blue" }: { icon: React.ComponentType<{ size?: number }>; label: string; value: string | number; tone?: Tone }) {
    return (
        <Card className="p-5">
            <div className={`w-10 h-10 rounded-xl ${tones[tone]} flex items-center justify-center mb-4`}>
                <Icon size={20} />
            </div>
            <div className="text-2xl font-bold text-foreground">{value}</div>
            <div className="text-sm text-muted-foreground mt-1">{label}</div>
        </Card>
    );
}

export function Status({ status }: { status: string }) {
    const classes =
        status === "Paid"
            ? "bg-success-bg text-success"
            : status === "Served"
                ? "bg-info-bg text-info"
                : "bg-warning-bg text-warning";

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${classes}`}>{status}</span>
    );
}

export function EmptyState({ message }: { message: string }) {
    return <div className="py-10 text-center text-sm text-muted-foreground">{message}</div>;
}

export function Spinner({ full = false }) {
    return (
        <div className={`flex items-center justify-center ${full ? "min-h-screen" : "py-16"}`}>
            <Loader2 className="animate-spin text-primary" size={28} />
        </div>
    );
}

export function ErrorState({ message, onRetry }: { message: string, onRetry: () => void }) {
    return (
        <div className="py-12 text-center">
            <AlertCircle className="mx-auto text-danger" size={28} />
            <p className="mt-3 text-sm text-muted-foreground">{message}</p>
            {onRetry && (
                <button onClick={onRetry} className="btn-secondary mt-4">
                    Try again
                </button>
            )}
        </div>
    );
}


interface PageStateProps {
    loading: boolean,
    error: string,
    children: React.ReactNode,
    onRetry: () => void
}

// Shows a spinner / error / content depending on a useFetch result
export function PageState({ loading, error, onRetry, children }: PageStateProps) {
    if (loading) return <Spinner />;
    if (error) return <ErrorState message={error} onRetry={onRetry} />;
    return children;
}


interface ToastProps {
    type: string,
    message: string
}

export function Toast(toast: ToastProps) {
    if (!toast) return null;
    const isError = toast.type === "error";

    return (
        <div className="fixed right-6 bottom-6 bg-foreground text-background px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 z-50">
            {isError ? (
                <AlertCircle size={18} className="text-danger" />
            ) : (
                <CheckCircle2 size={18} className="text-success" />
            )}
            {toast.message}
        </div>
    );
}



interface FieldProps {
    label: string,
    children: React.ReactNode
}

export function Field({ label, children }: FieldProps) {
    return (
        <div className="mb-4">
            <label className="label">{label}</label>
            {children}
        </div>
    );
}


