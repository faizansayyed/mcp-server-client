import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import { createUser } from "../../services/userService";

export function registerCreateUserTool(server: McpServer) {
    server.registerTool("create user",
        {
            title: "Create User",
            description: "Creates a user with name, email, phone, and address., if user didnt provide any information, create a random record with required details.",
            inputSchema: {
                name: z.string(),
                email: z.string().email(),
                phone: z.string(),
                address: z.string()
            },
        },
        async ({ name, email, phone, address }) => {
            const result = await createUser({ name, email, phone, address });
            return {
                content: [{ type: "text", text: result }]
            };
        }
    );
}