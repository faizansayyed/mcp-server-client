import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getUserById } from "../../services/userService";

export function registerUserDetailsResource(server: McpServer) {

    // Dynamic resource with parameters
    server.registerResource(
        "user-details",
        new ResourceTemplate("users://{userId}/details", { list: undefined }),
        {
            title: "User Details",
            description: "Get user details by ID",
            mimetype: "application/json"
        },
        async (uri, { userId }) => {
            const url = new URL(uri.href);

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