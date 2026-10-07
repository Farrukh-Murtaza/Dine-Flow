import type { User } from "../models";
import { http } from "./client";

export interface ChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
}

export interface LoginResponse {
    message: string;
    token: string;
    user: User;
}


export const authApi = {
    login: (credentials: { email: string, password: string }) => http.post<LoginResponse>("/auth/login", credentials), // -> { token, message }
    me: () => http.get<User>("/auth/me"), // -> user
    changePassword: (payload: ChangePasswordPayload) =>
        http.put<{ message: string, token: string }>("/users/reset-password", payload),
};
