import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import fs from "fs/promises";
import path from "path";
import z from "zod";

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

async function main() {
    // Start receiving messages on stdin and sending messages on stdout
    const transport = new StdioServerTransport();
    await server.connect(transport);
}

interface User {
    id?: string; // Optional, will be assigned when creating a new user
    name: string;
    email: string;
    phone: string;
    address: string;
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