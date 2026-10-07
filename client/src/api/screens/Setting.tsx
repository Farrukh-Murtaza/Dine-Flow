import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { authApi } from "../auth";
import { getErrorMessage, setToken } from "../../api/client";
import { settingsApi, type RestaurantSettings } from "../../api/settings";
import { Card, Field, PageState } from "../../components/ui";
import { useAuth } from "../../context/auth-context/useAuth";
import { useToast } from "../../context/toast-context/useToast";
import useFetch from "../../context/useFetch";
import { ROLES } from "../../config/navigation";

export default function SettingsScreen() {
    const { user } = useAuth();

    return (
        <div className="max-w-3xl space-y-5">
            {/* Restaurant details: Owner only. For other roles the component is never
          mounted, so the /settings request is never sent. */}
            {user?.role === ROLES.OWNER && <RestaurantSettingsCard />}

            {/* Every role can change their own password */}
            <PasswordCard />
        </div>
    );
}

/* ---------------- Restaurant details ---------------- */

const RESTAURANT_FIELDS: { key: keyof RestaurantSettings; label: string }[] = [
    { key: "name", label: "Restaurant name" },
    { key: "address", label: "Address" },
    { key: "phone", label: "Phone" },
];

function RestaurantSettingsCard() {
    const toast = useToast();
    const { data, loading, error, refetch } = useFetch<RestaurantSettings>((signal) =>
        settingsApi.get(signal),
    );

    const [form, setForm] = useState<RestaurantSettings>({ _id: "", name: "", address: "", phone: "" });
    const [saving, setSaving] = useState(false);

    // copy the server values into the form once they arrive
    useEffect(() => {
        if (data) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setForm({ _id: data._id, name: data.name ?? "", address: data.address ?? "", phone: data.phone ?? "" });
        }
    }, [data]);

    const handleChange =
        (key: keyof RestaurantSettings) => (event: ChangeEvent<HTMLInputElement>) => {
            const { value } = event.target;
            setForm((current) => ({ ...current, [key]: value }));
        };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSaving(true);
        try {
            await settingsApi.update(form);
            toast.success("Restaurant settings saved");
        } catch (err) {
            toast.error(getErrorMessage(err));
        } finally {
            setSaving(false);
        }
    };

    return (
        <Card className="p-7">
            <h3 className="mb-6 text-xl font-bold">Restaurant Settings</h3>

            <PageState loading={loading} error={error} onRetry={refetch}>
                <form onSubmit={handleSubmit}>
                    {RESTAURANT_FIELDS.map(({ key, label }) => (
                        <Field key={key} label={label}>
                            <input
                                required={key === "name"}
                                className="input"
                                value={form[key]}
                                onChange={handleChange(key)}
                            />
                        </Field>
                    ))}

                    <button type="submit" disabled={saving} className="btn-primary mt-2">
                        {saving ? "Saving..." : "Save changes"}
                    </button>
                </form>
            </PageState>
        </Card>
    );
}

/* ---------------- Change password ---------------- */

interface PasswordForm {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const EMPTY_PASSWORD_FORM: PasswordForm = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
};

const MIN_PASSWORD_LENGTH = 8;

function PasswordCard() {
    const toast = useToast();
    const [form, setForm] = useState<PasswordForm>(EMPTY_PASSWORD_FORM);
    const [formError, setFormError] = useState("");
    const [saving, setSaving] = useState(false);

    const handleChange = (key: keyof PasswordForm) => (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setForm((current) => ({ ...current, [key]: value }));
    };

    const validate = (): string => {
        if (form.newPassword.length < MIN_PASSWORD_LENGTH) {
            return `New password must be at least ${MIN_PASSWORD_LENGTH} characters`;
        }
        if (form.newPassword !== form.confirmPassword) {
            return "New password and confirmation do not match";
        }
        if (form.newPassword === form.currentPassword) {
            return "New password must be different from the current one";
        }
        return "";
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const problem = validate();
        setFormError(problem);
        if (problem) return;

        setSaving(true);
        try {
            const data = await authApi.changePassword({
                currentPassword: form.currentPassword,
                newPassword: form.newPassword,
            });

            setToken(data.token);
            setForm(EMPTY_PASSWORD_FORM);
            toast.success(data.message);
        } catch (err) {
            // e.g. "Current password is incorrect" returned by the server
            setFormError(getErrorMessage(err));
        } finally {
            setSaving(false);
        }
    };

    return (
        <Card className="p-7">
            <h3 className="text-xl font-bold">Change Password</h3>
            <p className="mb-6 mt-1 text-sm text-muted-foreground">
                Confirm your current password before choosing a new one.
            </p>

            <form onSubmit={handleSubmit}>
                <Field label="Current password">
                    <input
                        required
                        type="password"
                        autoComplete="current-password"
                        className="input"
                        value={form.currentPassword}
                        onChange={handleChange("currentPassword")}
                    />
                </Field>

                <Field label="New password">
                    <input
                        required
                        type="password"
                        autoComplete="new-password"
                        className="input"
                        value={form.newPassword}
                        onChange={handleChange("newPassword")}
                    />
                </Field>

                <Field label="Confirm new password">
                    <input
                        required
                        type="password"
                        autoComplete="new-password"
                        className="input"
                        value={form.confirmPassword}
                        onChange={handleChange("confirmPassword")}
                    />
                </Field>

                {formError && (
                    <p role="alert" className="mb-4 text-sm text-danger">
                        {formError}
                    </p>
                )}

                <button type="submit" disabled={saving} className="btn-primary">
                    {saving ? "Updating..." : "Update password"}
                </button>
            </form>
        </Card>
    );
}