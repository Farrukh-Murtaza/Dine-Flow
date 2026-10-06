


export interface User {
    id: string;
    username: string;
    email: string;
    role: "owner" | "manager" | "storekeeper" | "cashier";
}


export interface LoginResponse {
    message: string;
    token: string;
    user: User;
}

