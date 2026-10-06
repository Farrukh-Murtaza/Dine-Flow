import { createContext } from "react";

export interface User {
    username: string;
    email: string;
    role: string,
    isActive: boolean
}

export interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);