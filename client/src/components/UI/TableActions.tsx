
import { Pencil, Trash2 } from "lucide-react";

type TableActionsProps = {
    name: string;
    onEdit: () => void;
    onDelete: () => void;
    deleting?: boolean;
};

export default function TableActions({
    name,
    onEdit,
    onDelete,
    deleting = false,
}: TableActionsProps) {
    return (
        <td className="px-6 py-4">
            <div className="flex justify-end gap-2">
                {/* Edit */}
                <button
                    type="button"
                    className="btn-secondary px-3 py-2"
                    onClick={onEdit}
                    aria-label={`Edit ${name}`}
                >
                    <Pencil size={16} />
                </button>

                {/* Delete */}
                <button
                    type="button"
                    className="btn-secondary px-3 py-2 text-danger hover:text-danger"
                    onClick={onDelete}
                    disabled={deleting}
                    aria-label={`Delete ${name}`}
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </td>
    );
}