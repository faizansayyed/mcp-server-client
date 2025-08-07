import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getUserById } from "../../services/userService";

export function registerUserDetailsResource(server: McpServer) {
    server.registerResource(
        "user-details",
        new ResourceTemplate("users://{id}", { list: undefined }),
        {
            title: "User Details",
            description: "Get user details by ID",
            mimetype: "application/json",
        },
        async (uri) => {
            const url = new URL(uri.href);
            const userId = url.pathname.split('/').pop();

            if (!userId) {
                throw new Error("User ID is required");
            }

            const user = await getUserById(userId);
            return {
                contents: [{
                    uri: uri.href,
                    text: JSON.stringify(user, null, 2)
                }]
            };
        }
    );
}