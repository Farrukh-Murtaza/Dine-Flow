

export function StatusBadge({
    isActive,
}: {
    isActive?: boolean;
}) {
    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${isActive
                ? "bg-success-bg text-success"
                : "bg-danger-bg text-danger"
                }`}
        >
            {isActive ? "Active" : "Inactive"}
        </span>
    );
}