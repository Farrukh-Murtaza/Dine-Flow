import type { User } from ".";

export type OrderStatus = "pending" | "served" | "completed";

export const ORDER_STATUSES: OrderStatus[] = ["pending", "served", "completed"];

// GET /orders/:id populates menuItem with these fields;
// every other endpoint returns just the id string.
export type PopulatedMenuItem = {
    _id: string;
    name: string;
    imageUrl: string;
    category: string;
};

export type OrderItem = {
    menuItem: string | PopulatedMenuItem;
    name: string; // snapshot at order time
    price: number; // snapshot at order time
    quantity: number;
};

export type Order = {
    _id: string;
    tableNumber: string;
    items: OrderItem[];
    total: number;
    status: OrderStatus;
    notes?: string;
    user: User;
    createdAt: string;
    updatedAt: string;
};

export type OrderItemPayload = {
    menuItem: string;
    quantity: number;
};

export type CreateOrderPayload = {
    tableNumber: string;
    items: OrderItemPayload[];
    notes?: string;
};

export type UpdateOrderPayload = {
    tableNumber?: string;
    items?: OrderItemPayload[];
    status?: OrderStatus;
    notes?: string;
};