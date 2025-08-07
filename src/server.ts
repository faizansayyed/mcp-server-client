import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import fs from "fs/promises";
import path from "path";
import z from "zod";
import { User } from "./types/user";

// Create an MCP server
const server = new McpServer({
    name: "demo-server",
    version: "1.0.0",
    capabilities: {
        prompts: {}
    }
});

// Add an addition tool
server.registerTool("create user",
    {
        title: "Create User",
        description: "Creates a user with name, email, phone, and address.",
        inputSchema: { name: z.string(), email: z.string().email(), phone: z.string(), address: z.string() },
    },
    async ({ name, email, phone, address }) => {
        const result = await createUser({ name, email, phone, address });
        return {
            content: [{ type: "text", text: result }]
        };
    }
);

// Add a dynamic greeting resource
server.registerResource(
    "users",
    new ResourceTemplate("users://all", { list: undefined }),
    {
        title: "Users",      // Display name for UI
        description: "get all users from data store",
        mimetype: "application/json",
    },
    async (uri) => {
        const users = await fs.readFile(path.resolve(__dirname, "data/user.json"), "utf-8");
        const usersData = JSON.parse(users);

        return {
            contents: [{
                uri: uri.href,
                text: JSON.stringify(usersData, null, 2)
            }]
        };
    }
);

// Add a user details resource (matching style)
server.registerResource(
    "user-details",                     // 1st argument: resource ID (string)
    new ResourceTemplate("users://{id}", { list: undefined }),  // 2nd argument: ResourceTemplate
    {
        title: "User Details",
        description: "Get user details by ID",
        mimetype: "application/json",
    },
    async (uri) => {
        const url = new URL(uri.href);
        const userId = url.pathname.split('/').pop(); // Extracting ID from the path
        const filePath = path.resolve(__dirname, "data/user.json");
        let users: User[] = [];
        try {
            const data = await fs.readFile(filePath, "utf-8");
            users = JSON.parse(data);
        } catch (err) {
            if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
        }
        const user = users.find(u => u.id === userId);
        if (!user) {
            throw new Error(`User with ID ${userId} not found.`);
        }
        return {
            contents: [{
                uri: uri.href,
                text: JSON.stringify(user, null, 2)
            }]
        };
    }
);

async function main() {
    // Start receiving messages on stdin and sending messages on stdout
    const transport = new StdioServerTransport();
    await server.connect(transport);
}



async function createUser(user: User): Promise<string> {
    const filePath = path.resolve(__dirname, "data/user.json");
    let users: User[] = [];
    try {
        const data = await fs.readFile(filePath, "utf-8");
        users = JSON.parse(data);
    } catch (err) {
        // If file doesn't exist, start with empty array
        if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
    }
    const id = users.length + 1;
    user = { ...user, id: id.toString() };
    users.push(user);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(users, null, 2), "utf-8");
    return `User ${user.name} created with ID ${user.id}.`;
}

main()