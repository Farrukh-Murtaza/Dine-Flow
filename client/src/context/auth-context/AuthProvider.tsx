import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { AUTH_EXPIRED_EVENT, clearToken, getToken, setToken } from "../../api/client";
import { authApi } from "../../api/auth";
import type { User } from "../../models";


function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(Boolean(getToken()));

    useEffect(() => {

        if (!getToken()) return;
        authApi
            .me()
            .then((data) => {
                setUser(data?.user ?? null);
            })
            .catch((err) => {
                console.error("Could not restore session:", err);
            })
            .finally(() => setLoading(false));
    }, []);

    // axios interceptor fires this when the server answers 401
    useEffect(() => {

        const onExpired = () => setUser(null);
        window.addEventListener(AUTH_EXPIRED_EVENT, onExpired);
        return () => window.removeEventListener(AUTH_EXPIRED_EVENT, onExpired);
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        const data = await authApi.login({ email, password });
        setToken(data.token);
        setUser(data.user);
        return data.user;
    }, []);

    const logout = useCallback(() => {
        clearToken();
        setUser(null);
    }, []);

    const value = useMemo(() => ({ user, loading, login, logout }), [user, loading, login, logout]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;