import type { MenuItem } from "../models";
import { http } from "./client";


export type MenuItemListResponse = {
    message: string;
    items: MenuItem[];
};

export type MenuItemResponse = {
    message: string;
    items: MenuItem;
};

const route = "/menu-items";

export const menuItemApi = {
    get: (signal?: AbortSignal) =>
        http.get<MenuItemListResponse>(route, { signal }),

    create: (payload: MenuItem) =>
        http.post<MenuItemResponse>(route, payload),

    update: (id: string, payload: MenuItem) =>
        http.put<MenuItemResponse>(`${route}/${id}`, payload),

    delete: (id: string) =>
        http.delete<{ message: string }>(
            `${route}/${id}`,
        ),
};