import type { ReactNode } from "react";

type PageHeaderProps = {
    eyebrow?: string;
    title: string;
    action?: ReactNode;
};

export function PageHeader({
    eyebrow,
    title,
    action,
}: PageHeaderProps) {
    return (
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
                {eyebrow && (
                    <p className="text-sm text-muted-foreground">
                        {eyebrow}
                    </p>
                )}

                <h2 className="mt-1 text-2xl font-bold">
                    {title}
                </h2>
            </div>

            {action}
        </div>
    );
}