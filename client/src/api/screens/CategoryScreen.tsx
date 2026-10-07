import {
  Pencil,
  Plus,
  Search,
  Trash2,
  UserRound,
} from "lucide-react";

import {
  useMemo,
  useState,
  type FormEvent,
} from "react";

import { Card, Field, Modal } from "../../components/ui";
import { useAuth } from "../../context/auth-context/useAuth";
import useFetch from "../../context/useFetch";
import type { Category } from "../../models";
import { categoryApi } from "../category-api";
import { useToast } from "../../context/toast-context/useToast";


type CategoryFormData = Category;

const ROLE_OPTIONS = [
  { value: "manager", label: "Manager" },
  { value: "cashier", label: "Cashier" },
  { value: "storekeeper", label: "Storekeeper" },
] as const;

export default function CategoryScreen() {
  const { user } = useAuth();
  const toast = useToast();

  const {
    data,
    loading,
    error,
    refetch,
  } = useFetch<{ categories: Category[] }>((signal) =>
    categoryApi.get(signal),
  );

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(
    null,
  );

  const canManageCategory =
    user?.role === "owner" ||
    user?.role === "manager";


  const availableRoles = useMemo(() => {
    if (user?.role === "owner") {
      return ROLE_OPTIONS;
    }

    if (user?.role === "manager") {
      return ROLE_OPTIONS.filter(
        (role) =>
          role.value === "cashier" ||
          role.value === "storekeeper",
      );
    }

    return [];
  }, [user?.role]);

  /*
   * Search is derived data.
   */
  const filteredCategory = useMemo(() => {
    const Category = data?.categories ?? [];
    const query = search.trim().toLowerCase();

    if (!query) {
      return Category;
    }

    return Category.filter((member) => {
      return (
        member.name?.toLowerCase().includes(query) ||
        member.description?.toLowerCase().includes(query)
      );
    });
  }, [data, search]);

  /*
   * Open Add modal.
   */
  function openAddModal() {
    setEditing(null);
    setModalOpen(true);
  }

  /*
   * Open Edit modal.
   */
  function openEditModal(Category: Category) {
    setEditing(Category);
    setModalOpen(true);
  }

  /*
   * Close modal.
   */
  function closeModal() {
    if (saving) {
      return;
    }

    setModalOpen(false);
    setEditing(null);
  }

  /*
   * CREATE / UPDATE
   */
  async function handleSave(formData: CategoryFormData) {
    try {
      setSaving(true);

      /*
       * UPDATE
       */
      if (editing?._id) {
        const updatePayload = {
          name: formData.name,
          description: formData.description,
          displayOrder: formData.displayOrder,
        };

        const response = await categoryApi.update(editing._id, {
          ...updatePayload,
        });

        toast.success(response.message);
      }

      /*
      * CREATE
      */
      else {
        const response = await categoryApi.create({
          name: formData.name.trim(),
          description: formData.description.trim(),
          displayOrder: formData.displayOrder,
        });
        toast.success(response.message);
      }

      setModalOpen(false);
      setEditing(null);

      /*
       * refetch() returns void.
       * Do NOT use await here.
       */
      refetch();
    } catch (error) {
      console.error("Failed to save Category:", error);
    } finally {
      setSaving(false);
    }
  }

  /*
   * DELETE
   */
  async function handleDelete(Category: Category) {
    if (!Category._id) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${Category.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(Category._id);

      const response = await categoryApi.delete(Category._id);
      toast.success(response.message);

      refetch();
    } catch (error) {
      console.error(
        "Failed to delete Category:",
        error,
      );
    } finally {
      setDeletingId(null);
    }
  }

  if (!canManageCategory) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">
          You do not have permission to manage Category.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-muted-foreground">
            Restaurant Category
          </p>

          <h2 className="mt-1 text-2xl font-bold">
            Category Management
          </h2>
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={openAddModal}
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />

          <input
            type="search"
            className="input pl-10"
            placeholder="Search Category..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>
      </Card>

      {/* Error */}
      {error && (
        <Card className="border-danger p-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-danger">
              Failed to load Category.
            </p>

            <button
              type="button"
              className="btn-secondary"
              onClick={refetch}
            >
              Try Again
            </button>
          </div>
        </Card>
      )}

      {/* Category Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-190 text-left text-sm">
            <thead className="bg-surface-muted text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-medium">
                  Name
                </th>

                <th className="px-6 py-4 font-medium">
                  Description
                </th>

                <th className="px-6 py-4 text-right font-medium">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {/* Loading */}
              {loading && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-muted-foreground"
                  >
                    Loading Category...
                  </td>
                </tr>
              )}

              {/* Data */}
              {!loading &&
                !error &&
                filteredCategory.map((member) => (
                  <CategoryRow
                    key={member._id}
                    Category={member}
                    onEdit={() =>
                      openEditModal(member)
                    }
                    onDelete={() =>
                      handleDelete(member)
                    }
                    deleting={
                      deletingId === member._id
                    }
                  />
                ))}

              {/* Empty */}
              {!loading &&
                !error &&
                filteredCategory.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center"
                    >
                      <div className="flex flex-col items-center">
                        <UserRound
                          size={36}
                          className="text-muted-foreground"
                        />

                        <p className="mt-3 font-medium">
                          No Category found
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                          {search
                            ? "Try changing your search."
                            : "Add your first Category member."}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <CategoryModal
          Category={editing}
          roles={availableRoles}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

/*
 * --------------------------------------------------------------------------
 * Category Row
 * --------------------------------------------------------------------------
 */

function CategoryRow({
  Category,
  onEdit,
  onDelete,
  deleting,
}: {
  Category: Category;
  onEdit: () => void;
  onDelete: () => void;
  deleting: boolean;
}) {
  return (
    <tr className="border-t border-border">
      {/* Username */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <UserRound size={18} />
          </div>

          <span className="font-semibold">
            {Category.name}
          </span>
        </div>
      </td>

      {/* Email */}
      <td className="px-6 py-4 text-muted-foreground">
        {Category.description}
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex justify-end gap-2">
          {/* Edit */}
          <button
            type="button"
            className="btn-secondary px-3 py-2"
            onClick={onEdit}
            aria-label={`Edit ${Category.name}`}
          >
            <Pencil size={16} />
          </button>

          {/* Delete */}
          <button
            type="button"
            className="btn-secondary px-3 py-2 text-danger hover:text-danger"
            onClick={onDelete}
            disabled={deleting}
            aria-label={`Delete ${Category.name}`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}

/*
 * --------------------------------------------------------------------------
 * Category Modal
 * --------------------------------------------------------------------------
 */

function CategoryModal({
  Category,
  onClose,
  onSave,
}: {
  Category: Category | null;
  roles: readonly {
    value: string;
    label: string;
  }[];
  onClose: () => void;
  onSave: (
    data: CategoryFormData,
  ) => void | Promise<void>;
}) {
  const [name, setName] = useState(
    Category?.name ?? "",
  );

  const [description, setDescription] = useState(
    Category?.description ?? "",
  );


  const [submitting, setSubmitting] =
    useState(false);

  async function submit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    try {
      setSubmitting(true);

      await onSave({
        name: name.trim(),
        description: description.trim()
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      title={
        Category ? "Edit Category" : "Add Category"
      }
      onClose={onClose}
    >
      <form
        onSubmit={submit}
        className="space-y-5"
      >
        {/* Name */}
        <Field label="Name">
          <input
            className="input"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="Enter Category Name"
            autoComplete="category"
            required
          />
        </Field>

        {/* Description */}
        <Field label="Description">
          <input
            className="input"
            type="text"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            placeholder="Enter Category Description"
            autoComplete="description"
            required
          />
        </Field>
        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn-primary"
            disabled={submitting}
          >
            {submitting
              ? "Saving..."
              : Category
                ? "Save Changes"
                : "Add Category"}
          </button>
        </div>
      </form>
    </Modal>
  );
}