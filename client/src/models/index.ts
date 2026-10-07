


export interface User {
    _id?: string;
    username: string;
    email: string;
    role: "owner" | "manager" | "storekeeper" | "cashier";
    password?: string;
    isActive: boolean
}


export interface LoginResponse {
    message: string;
    token: string;
    user: User;
}

