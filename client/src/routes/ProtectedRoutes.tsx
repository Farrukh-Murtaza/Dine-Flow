import type { ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/auth-context/useAuth";
import { homePathFor } from "../config/navigation";
import { Spinner } from "../components/ui";


// Requires a signed-in user
export function ProtectedRoute() {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return <Spinner full />;
    if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
    return <Outlet />;
}

// Requires one of the given roles
interface RequireRoleProps {
    roles?: string[];
    children?: ReactNode;
}

export function RequireRole({ roles, children }: RequireRoleProps) {
    const { user } = useAuth();

    if (!user) return <Navigate to="/login" replace />;

    if (roles && !roles.includes(user.role)) {
        return <Navigate to={homePathFor(user.role)} replace />;
    }
    return <>{children}</>;
}