import client from "./client";

interface credientialProperty {
    email: string,
    password: string
}


export const authApi = {
    login: (credentials: credientialProperty) => client.post("/auth/login", credentials), // -> { token, message }
    me: () => client.get("/auth/me"), // -> user
};
