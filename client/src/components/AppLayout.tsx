import {
    LogOut,
    Menu as MenuIcon,
    Moon,
    Sun,
    Utensils,
    X,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
    Outlet,
    useLocation,
    useNavigate,
} from "react-router-dom";

import { navForRole } from "../config/navigation";
import { useAuth } from "../context/auth-context/useAuth";
import { NavItem } from "./ui";

export default function AppLayout() {
    const { user, logout } = useAuth();

    const { pathname } = useLocation();
    const navigate = useNavigate();

    const [mobileOpen, setMobileOpen] = useState(false);

    const [dark, setDark] = useState(
        () => localStorage.getItem("dineflow_theme") === "dark"
    );

    console.log(user)
    const items = navForRole(user?.role ?? "");

    const title =
        items.find((item) => item.to === pathname)?.label ?? "DineFlow";

    useEffect(() => {
        document.documentElement.classList.toggle("dark", dark);

        localStorage.setItem(
            "dineflow_theme",
            dark ? "dark" : "light"
        );
    }, [dark]);

    function signOut() {
        logout();

        navigate("/login", {
            replace: true,
        });
    }

    return (
        <div className="min-h-screen bg-background text-foreground md:flex">

            {/* Mobile overlay */}
            {mobileOpen && (
                <button
                    className="fixed inset-0 z-30 bg-black/40 md:hidden"
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close sidebar"
                />
            )}

            {/* SIDEBAR */}
            <aside
                className={`
          fixed
          inset-y-0
          left-0
          z-40
          flex
          w-72
          flex-col
          bg-sidebar
          text-sidebar-foreground
          shadow-xl
          transition-transform

          md:static
          md:translate-x-0

          ${mobileOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                    }
        `}
            >

                {/* Logo */}
                <div className="flex items-center justify-between border-b border-sidebar-foreground/10 px-5 py-5">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface text-primary">
                            <Utensils size={20} />
                        </div>

                        <div>
                            <h1 className="text-lg font-bold">
                                DineFlow
                            </h1>

                            <p className="text-xs text-sidebar-muted">
                                Restaurant Management
                            </p>
                        </div>

                    </div>

                    <button
                        className="md:hidden"
                        onClick={() => setMobileOpen(false)}
                        aria-label="Close sidebar"
                    >
                        <X size={20} />
                    </button>

                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto px-3 py-5">

                    <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-sidebar-muted">
                        Main Menu
                    </p>

                    <div className="space-y-1">

                        {items.map((item) => (
                            <NavItem
                                key={item.to}
                                icon={item.icon}
                                label={item.label}
                                to={item.to}
                                badge=""
                                onClick={() => setMobileOpen(false)}
                            />
                        ))}

                    </div>

                    {/* Debug fallback */}
                    {items.length === 0 && (
                        <div className="mx-2 mt-4 rounded-xl border border-red-400/30 bg-red-500/10 p-3">
                            <p className="text-xs font-semibold text-red-400">
                                No navigation items
                            </p>

                            <p className="mt-1 text-[11px] text-sidebar-muted">
                                Current role:
                            </p>

                            <p className="text-xs font-bold">
                                {user?.role || "No role"}
                            </p>
                        </div>
                    )}

                </nav>

                {/* User section */}
                <div className="border-t border-sidebar-foreground/10 p-4">

                    <div className="mb-3 rounded-xl bg-sidebar-foreground/10 p-3">

                        <p className="truncate text-sm font-semibold">
                            {user?.username || "User"}
                        </p>

                        <p className="mt-1 text-xs capitalize text-sidebar-muted">
                            {user?.role || "Unknown role"}
                        </p>

                    </div>

                    <button
                        onClick={signOut}
                        className="
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-4
              py-3
              text-sm
              font-medium
              text-sidebar-muted
              transition
              hover:bg-sidebar-foreground/10
              hover:text-sidebar-foreground
            "
                    >
                        <LogOut size={18} />

                        Sign out
                    </button>

                </div>

            </aside>

            {/* MAIN */}
            <main className="min-w-0 flex-1">

                {/* HEADER */}
                <header
                    className="
            sticky
            top-0
            z-20
            flex
            h-20
            items-center
            border-b
            border-border
            bg-surface/95
            px-5
            backdrop-blur
            md:px-8
          "
                >

                    {/* Mobile menu */}
                    <button
                        className="mr-3 rounded-lg p-2 hover:bg-surface-muted md:hidden"
                        onClick={() => setMobileOpen(true)}
                        aria-label="Open menu"
                    >
                        <MenuIcon size={22} />
                    </button>

                    {/* Page title */}
                    <div>

                        <h1 className="text-xl font-bold">
                            {title}
                        </h1>

                        <p className="hidden text-xs capitalize text-muted-foreground sm:block">
                            {user?.role} workspace
                        </p>

                    </div>

                    {/* Header right */}
                    <div className="ml-auto flex items-center gap-3">

                        <span className="hidden text-sm text-muted-foreground sm:block">
                            {user?.username}
                        </span>

                        <button
                            onClick={() => setDark((value) => !value)}
                            aria-label="Toggle dark mode"
                            className="rounded-xl p-2 text-muted-foreground hover:bg-surface-muted"
                        >
                            {dark ? (
                                <Sun size={18} />
                            ) : (
                                <Moon size={18} />
                            )}
                        </button>

                    </div>

                </header>

                {/* PAGE CONTENT */}
                <div className="mx-auto max-w-375 p-5 md:p-8">
                    <Outlet />
                </div>

            </main>

        </div>
    );
}