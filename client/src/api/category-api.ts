import type { Category } from "../models";
import { http } from "./client";

export type CategoryListResponse = {
    message: string;
    categories: Category[];
};

export type CategoryResponse = {
    message: string;
    categories: Category;
};

const route = "/categories";

export const categoryApi = {
    get: (signal?: AbortSignal) =>
        http.get<CategoryListResponse>(route, { signal }),

    create: (payload: Category) =>
        http.post<CategoryResponse>(route, payload),

    update: (id: string, payload: Category) =>
        http.put<CategoryResponse>(`${route}/${id}`, payload),

    delete: (id: string) =>
        http.delete<{ message: string }>(
            `${route}/${id}`,
        ),
};