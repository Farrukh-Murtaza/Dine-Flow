


export interface User {
    _id?: string;
    username: string;
    email: string;
    role: "owner" | "manager" | "storekeeper" | "cashier";
    password?: string;
    isActive: boolean
}
export interface Category {
    _id?: string;
    name: string;
    description: string;
    displayOrder?: 0
}

export interface MenuItem {
    _id?: string;
    name: string;
    description: string;
    category: Category;
    price: number;
    isAvailable: boolean;
    imageUrl: string;
}