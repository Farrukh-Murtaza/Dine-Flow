import type { LoginResponse, User } from "../models";
import { http } from "./client";

export const authApi = {
    login: (credentials: { email: string, password: string }) => http.post<LoginResponse>("/auth/login", credentials), // -> { token, message }
    me: () => http.get<User>("/auth/me"), // -> user
};
