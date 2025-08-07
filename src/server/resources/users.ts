import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getAllUsers } from "../../services/userService";

export function registerUsersResource(server: McpServer) {
    server.registerResource(
        "users",
        new ResourceTemplate("users://all", { list: undefined }),
        {
            title: "Users",
            description: "get all users from data store",
            mimetype: "application/json",
        },
        async (uri) => {
            const users = await getAllUsers();
            return {
                contents: [{
                    uri: uri.href,
                    text: JSON.stringify(users, null, 2)
                }]
            };
        }
    );
}