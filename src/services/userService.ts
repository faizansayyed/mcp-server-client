import fs from "fs/promises";
import path from "path";
import { User } from "../types/user";

const USER_DATA_PATH = path.resolve(__dirname, "../data/user.json");

async function readUserData(): Promise<User[]> {
    try {
        const data = await fs.readFile(USER_DATA_PATH, "utf-8");
        return JSON.parse(data);
    } catch (err) {
        if ((err as NodeJS.ErrnoException).code === "ENOENT") {
            return [];
        }
        throw err;
    }
}

async function writeUserData(users: User[]): Promise<void> {
    await fs.mkdir(path.dirname(USER_DATA_PATH), { recursive: true });
    await fs.writeFile(USER_DATA_PATH, JSON.stringify(users, null, 2), "utf-8");
}

export async function getAllUsers(): Promise<User[]> {
    return await readUserData();
}

export async function getUserById(id: string | string[]): Promise<User> {
    const users = await readUserData();
    const user = users.find(u => u.id.toString() === id.toString());
    if (!user) {
        throw new Error(`User with ID ${id} not found.`);
    }
    return user;
}

export async function createUser(user: Omit<User, "id">): Promise<string> {
    const users = await readUserData();
    const id = (users.length + 1).toString();
    const newUser = { ...user, id };
    users.push(newUser);
    await writeUserData(users);
    return `User ${user.name} created with ID ${id}.`;
}