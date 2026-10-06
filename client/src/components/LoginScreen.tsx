import React, { useState } from "react";
import { Utensils } from "lucide-react";
import { authApi } from "../api/auth";
import { getErrorMessage } from "../api/client";


export default function LoginScreen() {
    const [formData, setFormData] = useState({ email: "manager@dineflow.com", password: "asdf112" });

    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);


    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    }

    const submit = async (event: React.SubmitEvent) => {
        event.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            console.log(formData)
            const signedIn = await authApi.login(formData);
            console.log(signedIn);

        } catch (err) {
            setError(getErrorMessage(err, "Unable to sign in"));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-5xl bg-surface rounded-3xl overflow-hidden shadow-xl grid md:grid-cols-2">
                <div className="p-10 md:p-14 text-sidebar-foreground flex flex-col justify-between min-h-145 bg-sidebar">
                    <div>
                        <div className="flex items-center gap-3 text-2xl font-bold">
                            <div className="w-11 h-11 rounded-xl bg-surface flex items-center justify-center text-primary">
                                <Utensils />
                            </div>
                            DineFlow
                        </div>

                        <h1 className="text-4xl font-bold leading-tight mt-20">
                            Restaurant operations,
                            <br />
                            flowing smoothly.
                        </h1>

                        <p className="text-sidebar-muted mt-5 max-w-sm">
                            Orders, inventory, staff and reporting in one role-aware workspace.
                        </p>
                    </div>

                    <p className="text-sidebar-muted text-sm">Restaurant Management System</p>
                </div>

                <form
                    onSubmit={submit}
                    className="p-10 md:p-14 flex flex-col justify-center">
                    <p className="text-sm font-semibold text-primary">WELCOME BACK</p>
                    <h2 className="text-3xl font-bold mt-2 text-foreground">Sign in to DineFlow</h2>
                    <p className="text-muted-foreground mt-2 mb-8">Use the account created for you by your manager.</p>

                    <label className="label">Email</label>
                    <input
                        type="email"
                        required
                        name="email"
                        autoComplete="email"
                        className="input mb-4"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <label className="label">Password</label>
                    <input
                        type="password"
                        required
                        name="password"
                        autoComplete="current-password"
                        className="input mb-6"
                        value={formData.password}
                        onChange={handleChange}
                    />

                    {error && <p className="mb-4 text-sm text-danger">{error}</p>}

                    <button type="submit"
                        disabled={submitting}
                        className="btn-primary py-3.5">
                        {submitting ? "Signing in..." : "Sign in"}
                    </button>
                </form>
            </div>
        </div>
    );
}
