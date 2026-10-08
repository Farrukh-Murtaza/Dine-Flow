import type { ReactNode } from "react";

type CrudGridProps = {
    loading: boolean;
    error?: string;
    isEmpty: boolean;

    loadingMessage?: string;
    emptyTitle?: string;
    emptyMessage?: string;

    onRetry?: () => void;

    children: ReactNode;
};

export default function CrudGrid({
    loading,
    error,
    isEmpty,
    loadingMessage = "Loading...",
    emptyTitle = "No records found",
    emptyMessage = "Add your first record.",
    onRetry,
    children,
}: CrudGridProps) {
    if (loading) {
        return (
            <div className="grid md:grid-cols-2 xl:grid-cols- gap-4">
                {loadingMessage}
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-2xl border border-danger bg-danger-bg p-6">
                <div className="flex items-center justify-between gap-4">
                    <p className="text-sm text-danger">
                        {error}
                    </p>

                    {onRetry && (
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={onRetry}
                        >
                            Try Again
                        </button>
                    )}
                </div>
            </div>
        );
    }

    if (isEmpty) {
        return (
            <div className="rounded-2xl border border-border bg-surface px-6 py-12 text-center">
                <p className="font-medium">
                    {emptyTitle}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                    {emptyMessage}
                </p>
            </div>
        );
    }

    return (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {children}
        </div>
    );
}