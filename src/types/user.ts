export interface User {
    id?: string; // Optional, will be assigned when creating a new user
    name: string;
    email: string;
    phone: string;
    address: string;
}