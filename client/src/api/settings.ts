import { http } from "./client";

export interface RestaurantSettings {
    _id: string,
    name: string;
    address: string;
    phone: string;
}

export const settingsApi = {
    get: (signal?: AbortSignal) => http.get<RestaurantSettings>("/restaurants", { signal }),
    update: (payload: RestaurantSettings) => http.put<RestaurantSettings>("/restaurants", payload),
};