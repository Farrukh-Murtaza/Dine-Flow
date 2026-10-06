import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Menu as MenuIcon, Moon, Sun } from "lucide-react";
import { navItems } from "../config/navigation";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Sidebar from "./Sidebar";

export default function AppLayout() {
    const { user } = useAuth();
    const { theme, toggle } = useTheme();
    const { pathname } = useLocation();
    const [mobile, setMobile] = useState(false);
    const title = navItems.find((item) => item.to === pathname)?.label || "DineFlow";

    return (
        <div className="min-h-screen flex">
            <Sidebar mobile={mobile} setMobile={setMobile} />

            <main className="flex-1 min-w-0">
                <header className="h-20 bg-surface border-b flex items-center px-5 md:px-8 sticky top-0 z-10">
                    <button className="md:hidden mr-3" onClick={() => setMobile(true)} aria-label="Open menu">
                        <MenuIcon />
                    </button>

                    <div>
                        <h1 className="text-xl font-bold">{title}</h1>
                        <p className="text-xs text-muted-foreground hidden sm:block">{user.role} workspace</p>
                    </div>

                    <div className="ml-auto flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">{user.name}</span>
                        <button
                            onClick={toggle}
                            aria-label="Toggle dark mode"
                            className="p-2 rounded-dineflow text-muted-foreground hover:bg-surface-muted"
                        >
                            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                    </div>
                </header>

                <div className="p-5 md:p-8 max-w-375 mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
