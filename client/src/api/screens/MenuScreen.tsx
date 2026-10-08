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

import { Card, Field } from "../../components/ui";
import { useAuth } from "../../context/auth-context/useAuth";
import useFetch from "../../context/useFetch";
import type { Category, MenuItem } from "../../models";
import { menuItemApi } from "../menu-item-api";
import { useToast } from "../../context/toast-context/useToast";
import { categoryApi } from "../category-api";
import { StatusBadge } from "../../components/UI/StatusBadge";
import { Modal } from "../../components/UI/Modal";


export default function MenuItemScreen() {
  const { user } = useAuth();
  const toast = useToast();

  // For Categories
  const {
    data: categoryData,
  } = useFetch<{ categories: Category[] }>((signal) =>
    categoryApi.get(signal),
  );


  //Form MenuItem  
  const {
    data,
    loading,
    error,
    refetch,
  } = useFetch<{ items: MenuItem[] }>((signal) =>
    menuItemApi.get(signal),
  );

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(
    null,
  );

  const canManageMenuItem =
    user?.role === "owner" ||
    user?.role === "manager";


  /*
   * Search is derived data.
   */
  const filteredMenuItem = useMemo(() => {
    const MenuItem = data?.items ?? [];
    const query = search.trim().toLowerCase();

    if (!query) {
      return MenuItem;
    }

    return MenuItem.filter((member) => {
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
  function openEditModal(MenuItem: MenuItem) {
    setEditing(MenuItem);
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
  async function handleSave(formData: MenuItem) {
    try {
      setSaving(true);

      /*
       * UPDATE
       */
      if (editing?._id) {
        const updatePayload = {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          category: formData.category,
          imageUrl: formData.imageUrl,
          isAvailable: formData.isAvailable
        };

        const response = await menuItemApi.update(editing._id, {
          ...updatePayload,
        });

        toast.success(response.message);
      }

      /*
      * CREATE
      */
      else {
        const response = await menuItemApi.create({
          name: formData.name.trim(),
          description: formData.description.trim(),
          price: formData.price,
          category: formData.category,
          imageUrl: formData.imageUrl,
          isAvailable: formData.isAvailable
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
      console.error("Failed to save MenuItem:", error);
    } finally {
      setSaving(false);
    }
  }

  /*
   * DELETE
   */
  async function handleDelete(MenuItem: MenuItem) {
    if (!MenuItem._id) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${MenuItem.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(MenuItem._id);

      const response = await menuItemApi.delete(MenuItem._id);
      toast.success(response.message);

      refetch();
    } catch (error) {
      console.error(
        "Failed to delete MenuItem:",
        error,
      );
    } finally {
      setDeletingId(null);
    }
  }

  if (!canManageMenuItem) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">
          You do not have permission to manage MenuItem.
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
            Restaurant MenuItem
          </p>

          <h2 className="mt-1 text-2xl font-bold">
            MenuItem Management
          </h2>
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={openAddModal}
        >
          <Plus size={18} />
          Add MenuItem
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
            placeholder="Search MenuItem..."
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
              Failed to load MenuItem.
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

      {/* MenuItem Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-190 text-left text-sm">
            <thead className="bg-surface-muted text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-medium">
                  Name
                </th>
                <th className="px-6 py-4 font-medium">
                  Category
                </th>

                <th className="px-6 py-4 font-medium">
                  Price
                </th>

                <th className="px-6 py-4 font-medium">
                  Description
                </th>

                <th className="px-6 py-4 font-medium">
                  Status
                </th>

                <th className="px-6 py-4 text-right font-medium">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-muted-foreground"
                  >
                    Loading MenuItem...
                  </td>
                </tr>
              )}

              {!loading &&
                !error &&
                filteredMenuItem.map((member) => (
                  <MenuItemRow
                    key={member._id}
                    MenuItem={member}
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


              {!loading &&
                !error &&
                filteredMenuItem.length === 0 && (
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
                          No MenuItem found
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                          {search
                            ? "Try changing your search."
                            : "Add your first MenuItem member."}
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
        <MenuItemModal
          MenuItem={editing}
          categories={categoryData}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

/*
 * --------------------------------------------------------------------------
 * MenuItem Row
 * --------------------------------------------------------------------------
 */

function MenuItemRow({
  MenuItem,
  onEdit,
  onDelete,
  deleting,
}: {
  MenuItem: MenuItem;
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
            {MenuItem.name}
          </span>
        </div>
      </td>

      {/* description */}
      <td className="px-6 py-4 text-muted-foreground">
        {MenuItem.category.name}
      </td>


      {/* Price */}
      <td className="px-6 py-4 text-muted-foreground">
        {`$${MenuItem.price}`}
      </td>

      {/* description */}
      <td className="px-6 py-4 text-muted-foreground">
        {MenuItem.description}
      </td>


      {/* description */}
      <td className="px-6 py-4 text-muted-foreground">
        <StatusBadge
          isActive={MenuItem.isAvailable}
        />

      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex justify-end gap-2">
          {/* Edit */}
          <button
            type="button"
            className="btn-secondary px-3 py-2"
            onClick={onEdit}
            aria-label={`Edit ${MenuItem.name}`}
          >
            <Pencil size={16} />
          </button>

          {/* Delete */}
          <button
            type="button"
            className="btn-secondary px-3 py-2 text-danger hover:text-danger"
            onClick={onDelete}
            disabled={deleting}
            aria-label={`Delete ${MenuItem.name}`}
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
 * MenuItem Modal
 * --------------------------------------------------------------------------
 */

function MenuItemModal({
  MenuItem,
  categories,
  onClose,
  onSave,
}: {
  MenuItem: MenuItem | null;
  categories: { categories: Category[] } | null;
  onClose: () => void;
  onSave: (data: MenuItem) => void | Promise<void>;
}) {
  const availableCategories = categories?.categories ?? [];

  const [name, setName] = useState(MenuItem?.name ?? "");
  const [description, setDescription] = useState(
    MenuItem?.description ?? "",
  );
  const [price, setPrice] = useState(MenuItem?.price ?? 0);
  const [category, setCategory] = useState<Category>(
    MenuItem?.category ?? availableCategories[0] ?? {
      name: "",
      description: "",
    },
  );
  const [imageUrl, setImageUrl] = useState(
    MenuItem?.imageUrl ?? "",
  );
  const [isAvailable, setIsAvailable] = useState(
    MenuItem?.isAvailable ?? true,
  );
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSubmitting(true);

      await onSave({
        _id: MenuItem?._id,
        name: name.trim(),
        description: description.trim(),
        price,
        category,
        imageUrl: imageUrl.trim(),
        isAvailable,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      title={MenuItem ? "Edit MenuItem" : "Add MenuItem"}
      onClose={onClose}
    >
      <form onSubmit={submit} className="space-y-5">
        <Field label="Name">
          <input
            className="input"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter MenuItem Name"
            autoComplete="MenuItem"
            required
          />
        </Field>

        <Field label="Description">
          <input
            className="input"
            type="text"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            placeholder="Enter MenuItem Description"
            autoComplete="description"
            required
          />
        </Field>

        <Field label="Price">
          <input
            className="input"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(event) =>
              setPrice(Number(event.target.value))
            }
            placeholder="Enter MenuItem Price"
            required
          />
        </Field>

        <Field label="Category">
          <select
            className="input"
            value={category?._id ?? ""}
            onChange={(event) => {
              const selectedCategory = availableCategories.find(
                (item) => item._id === event.target.value,
              );

              if (selectedCategory) {
                setCategory(selectedCategory);
              }
            }}
            required
          >
            <option value="" disabled>
              Select a category
            </option>

            {availableCategories.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Image URL">
          <input
            className="input"
            type="url"
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </Field>

        <Field label="Availability">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(event) =>
                setIsAvailable(event.target.checked)
              }
            />
            Available
          </label>
        </Field>

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
              : MenuItem
                ? "Save Changes"
                : "Add MenuItem"}
          </button>
        </div>
      </form>
    </Modal>
  );
}