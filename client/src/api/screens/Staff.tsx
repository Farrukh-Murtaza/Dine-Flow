import {
  Plus,
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
import type { User } from "../../models";
import { staffApi } from "../staff";
import { useToast } from "../../context/toast-context/useToast";
import { StatusBadge } from "../../components/UI/StatusBadge";
import { Modal } from "../../components/UI/Modal";
import TableActions from "../../components/UI/TableActions";
import { SearchInput } from "../../components/UI/SearchInput";
import { PageHeader } from "../../components/UI/PageHeader";

type Staff = User;

type StaffFormData = {
  username: string;
  email: string;
  password: string;
  role: Staff["role"];
  isActive: boolean;
};

const ROLE_OPTIONS = [
  { value: "manager", label: "Manager" },
  { value: "cashier", label: "Cashier" },
  { value: "storekeeper", label: "Storekeeper" },
] as const;

export default function Staff() {
  const { user } = useAuth();
  const toast = useToast();

  const {
    data,
    loading,
    error,
    refetch,
  } = useFetch<{ users: Staff[] }>((signal) =>
    staffApi.get(signal),
  );

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Staff | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(
    null,
  );

  const canManageStaff =
    user?.role === "owner" ||
    user?.role === "manager";

  /*
   * Owner can create:
   * - manager
   * - cashier
   * - storekeeper
   *
   * Manager can create:
   * - cashier
   * - storekeeper
   */
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
  const filteredStaff = useMemo(() => {
    const staff = data?.users ?? [];
    const query = search.trim().toLowerCase();

    if (!query) {
      return staff;
    }

    return staff.filter((member) => {
      return (
        member.username?.toLowerCase().includes(query) ||
        member.email?.toLowerCase().includes(query) ||
        member.role?.toLowerCase().includes(query)
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
  function openEditModal(staff: Staff) {
    setEditing(staff);
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
  async function handleSave(formData: StaffFormData) {
    try {
      setSaving(true);

      /*
       * UPDATE
       */
      if (editing?._id) {
        const updatePayload = {
          username: formData.username,
          email: formData.email,
          role: formData.role,
          isActive: formData.isActive,
        };

        /*
         * Only send password when the user actually entered one.
         */
        if (formData.password.trim()) {
          const response = await staffApi.update(editing._id, {
            ...updatePayload,
            password: formData.password.trim(),
          });
          toast.success(response.message);
        } else {
          const response = await staffApi.update(
            editing._id,
            updatePayload,
          );
          toast.success(response.message);
        }

      }

      /*
      * CREATE
      */
      else {
        const response = await staffApi.create({
          username: formData.username,
          email: formData.email,
          password: formData.password.trim(),
          role: formData.role,
          isActive: formData.isActive
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
      console.error("Failed to save staff:", error);
    } finally {
      setSaving(false);
    }
  }

  /*
   * DELETE
   */
  async function handleDelete(staff: Staff) {
    if (!staff._id) {
      return;
    }

    /*
     * Prevent deleting yourself.
     */
    if (staff._id === user?._id) {
      window.alert(
        "You cannot delete your own account.",
      );

      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${staff.username}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(staff._id);

      // await staffApi.delete(staff._id);

      refetch();
    } catch (error) {
      console.error(
        "Failed to delete staff:",
        error,
      );
    } finally {
      setDeletingId(null);
    }
  }

  if (!canManageStaff) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">
          You do not have permission to manage staff.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <PageHeader
        title="Restaurant Staff"
        eyebrow="Staff Management"
        action={
          <button
            type="button"
            className="btn-primary"
            onClick={openAddModal}
          >
            <Plus size={18} />
            Add Staff
          </button>
        }
      />

      {/* Search */}
      <Card className="p-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search staff..."
          className="max-w-md"
        />
      </Card>

      {/* Error */}
      {error && (
        <Card className="border-danger p-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-danger">
              Failed to load staff.
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

      {/* Staff Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-190 text-left text-sm">
            <thead className="bg-surface-muted text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-medium">
                  Username
                </th>

                <th className="px-6 py-4 font-medium">
                  Email
                </th>

                <th className="px-6 py-4 font-medium">
                  Role
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
              {/* Loading */}
              {loading && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-muted-foreground"
                  >
                    Loading staff...
                  </td>
                </tr>
              )}

              {/* Data */}
              {!loading &&
                !error &&
                filteredStaff.map((member) => (
                  <StaffRow
                    key={member._id}
                    staff={member}
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
                filteredStaff.length === 0 && (
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
                          No staff found
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                          {search
                            ? "Try changing your search."
                            : "Add your first staff member."}
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
        <StaffModal
          staff={editing}
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
 * Staff Row
 * --------------------------------------------------------------------------
 */

function StaffRow({
  staff,
  onEdit,
  onDelete,
  deleting,
}: {
  staff: Staff;
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
            {staff.username}
          </span>
        </div>
      </td>

      {/* Email */}
      <td className="px-6 py-4 text-muted-foreground">
        {staff.email}
      </td>

      {/* Role */}
      <td className="px-6 py-4">
        <RoleBadge role={staff.role} />
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <StatusBadge
          isActive={staff.isActive}
        />
      </td>

      {/* Actions */}
      <TableActions
        name={staff.username}
        onEdit={onEdit}
        onDelete={onDelete}
        deleting={deleting}
      />

    </tr>
  );
}

/*
 * --------------------------------------------------------------------------
 * Role Badge
 * --------------------------------------------------------------------------
 */

function RoleBadge({
  role,
}: {
  role: Staff["role"];
}) {
  return (
    <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold capitalize text-primary">
      {role}
    </span>
  );
}



/*
 * --------------------------------------------------------------------------
 * Staff Modal
 * --------------------------------------------------------------------------
 */

function StaffModal({
  staff,
  roles,
  onClose,
  onSave,
}: {
  staff: Staff | null;
  roles: readonly {
    value: string;
    label: string;
  }[];
  onClose: () => void;
  onSave: (
    data: StaffFormData,
  ) => void | Promise<void>;
}) {
  const [username, setUsername] = useState(
    staff?.username ?? "",
  );

  const [email, setEmail] = useState(
    staff?.email ?? "",
  );

  /*
   * Do not load staff.password here.
   *
   * Passwords should not be returned from the API.
   */
  const [password, setPassword] = useState("");

  const [role, setRole] = useState<string>(
    staff?.role ??
    roles[0]?.value ??
    "",
  );

  const [isActive, setIsActive] = useState(
    staff?.isActive ?? true,
  );

  const [submitting, setSubmitting] =
    useState(false);

  async function submit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!role) {
      return;
    }

    try {
      setSubmitting(true);

      await onSave({
        username: username.trim(),
        email: email.trim(),
        password: password.trim(),
        role: role as Staff["role"],
        isActive,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      title={
        staff ? "Edit Staff" : "Add Staff"
      }
      onClose={onClose}
    >
      <form
        onSubmit={submit}
        className="space-y-5"
      >
        {/* Username */}
        <Field label="Username">
          <input
            className="input"
            value={username}
            onChange={(event) =>
              setUsername(event.target.value)
            }
            placeholder="Enter username"
            autoComplete="username"
            required
          />
        </Field>

        {/* Email */}
        <Field label="Email">
          <input
            className="input"
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder="Enter email"
            autoComplete="email"
            required
          />
        </Field>

        {/* Password */}
        <Field
          label={
            staff
              ? "New Password (optional)"
              : "Password"
          }
        >
          <input
            className="input"
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            placeholder={
              staff
                ? "Leave blank to keep current password"
                : "Enter password"
            }
            autoComplete={
              staff
                ? "new-password"
                : "new-password"
            }
            required={!staff}
          />
        </Field>

        {/* Role */}
        <Field label="Role">
          <select
            className="input"
            value={role}
            onChange={(event) =>
              setRole(event.target.value)
            }
            required
          >
            <option value="" disabled>
              Select role
            </option>

            {roles.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </Field>

        {/* Status */}
        {staff && (
          <label className="flex items-center gap-3 text-sm font-medium">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(event) =>
                setIsActive(
                  event.target.checked,
                )
              }
            />

            <span>
              Active staff member
            </span>
          </label>
        )}

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
              : staff
                ? "Save Changes"
                : "Add Staff"}
          </button>
        </div>
      </form>
    </Modal>
  );
}