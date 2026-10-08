import { Pencil, Trash2 } from "lucide-react";

type CrudActionsProps = {
    name: string;
    onEdit?: () => void;
    onDelete?: () => void;
    editing?: boolean;
    deleting?: boolean;
};

export default function CrudActions({
    name,
    onEdit,
    onDelete,
    editing = false,
    deleting = false,
}: CrudActionsProps) {
    return (
        <div className="flex justify-end gap-2">
            {onEdit && (
                <button
                    type="button"
                    className="btn-secondary px-3 py-2"
                    onClick={onEdit}
                    disabled={editing || deleting}
                    aria-label={`Edit ${name}`}
                    title={`Edit ${name}`}
                >
                    <Pencil size={16} />
                </button>
            )}

            {onDelete && (
                <button
                    type="button"
                    className="btn-secondary px-3 py-2 text-danger hover:text-danger"
                    onClick={onDelete}
                    disabled={deleting || editing}
                    aria-label={`Delete ${name}`}
                    title={`Delete ${name}`}
                >
                    <Trash2 size={16} />
                </button>
            )}
        </div>
    );
}