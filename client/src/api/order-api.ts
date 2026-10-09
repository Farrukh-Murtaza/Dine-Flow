import type {
    CreateOrderPayload,
    Order,
    OrderStatus,
    UpdateOrderPayload,
} from "../models/order";
import { http } from "./client";

export type OrderListParams = {
    status?: OrderStatus;
    page?: number;
    limit?: number;
};

export type OrderListResponse = {
    orders: Order[];
    page: number;
    pages: number;
    count: number;
};

const route = "/orders";

const buildQuery = (params: OrderListParams) => {
    const qs = new URLSearchParams();
    if (params.status) qs.set("status", params.status);
    if (params.page) qs.set("page", String(params.page));
    if (params.limit) qs.set("limit", String(params.limit));
    const query = qs.toString();
    return query ? `${route}?${query}` : route;
};

export const orderApi = {
    get: (params: OrderListParams = {}, signal?: AbortSignal) =>
        http.get<OrderListResponse>(buildQuery(params), { signal }),

    getById: (id: string, signal?: AbortSignal) =>
        http.get<Order>(`${route}/${id}`, { signal }),

    create: (payload: CreateOrderPayload) =>
        http.post<Order>(route, payload),

    update: (id: string, payload: UpdateOrderPayload) =>
        http.put<Order>(`${route}/${id}`, payload),

    delete: (id: string) =>
        http.delete<{ message: string }>(`${route}/${id}`),
};