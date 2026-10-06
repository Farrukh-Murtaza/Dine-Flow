import { createContext } from "react";
import type { User } from "../../models";

export interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<User>;
    loading: boolean,
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);