import { Utensils } from "lucide-react";

import type { MenuItem } from "../../models";
import CrudActions from "../UI/CrudActions";
import { StatusBadge } from "../UI/StatusBadge";

type MenuItemCardProps = {
    menuItem: MenuItem;
    onEdit: () => void;
    onDelete: () => void;
    deleting?: boolean;
};

export default function MenuItemCard({
    menuItem,
    onEdit,
    onDelete,
    deleting = false,
}: MenuItemCardProps) {
    return (
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
            {/* Image + Status */}
            <div className="relative flex h-28 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-blue-50 to-slate-100 text-primary">
                {menuItem.imageUrl ? (
                    <img
                        src={menuItem.imageUrl}
                        alt={menuItem.name}
                        onError={(event) => {
                            event.currentTarget.style.display = "none";
                            event.currentTarget.nextElementSibling?.classList.remove("hidden");
                        }}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <Utensils size={38} />
                )}

                {/* Active Status - Top Right */}
                <div className="absolute right-3 top-3">
                    <StatusBadge isActive={menuItem.isAvailable} />
                </div>
            </div>

            {/* Category */}
            <p className="mt-4 text-xs font-semibold text-primary">
                {menuItem.category.name}
            </p>

            {/* Name */}
            <h3 className="mt-1 font-bold">{menuItem.name}</h3>

            {/* Description */}
            <p className="mt-1 h-8 overflow-hidden text-xs text-muted-foreground">
                {menuItem.description || "No description available."}
            </p>

            {/* Price + Actions */}
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                {/* Price */}
                <span className="font-bold">
                    ${menuItem.price.toFixed(2)}
                </span>

                {/* Edit + Delete */}
                <CrudActions
                    name={menuItem.name}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    deleting={deleting}
                />
            </div>
        </div>
    );
}
