import type { User } from "../models";
import { http } from "./client";

export type StaffPayload = User

export type StaffListResponse = {
    message: string;
    users: User[];
};

export type StaffResponse = {
    message: string;
    user: User;
};

const route = "/users";

export const staffApi = {
    get: (signal?: AbortSignal) =>
        http.get<StaffListResponse>(route, { signal }),

    create: (payload: StaffPayload) =>
        http.post<StaffResponse>(route, payload),

    update: (id: string, payload: StaffPayload) =>
        http.put<StaffResponse>(`${route}/${id}`, payload),

    deactivate: (id: string) =>
        http.put<{ message: string }>(
            `${route}/${id}`,
        ),
};