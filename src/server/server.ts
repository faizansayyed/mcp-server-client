import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerCreateUserTool } from "./tools/createUser";
import { registerUsersResource } from "./resources/users";
import { registerUserDetailsResource } from "./resources/userDetails";

async function main() {
    // Create an MCP server
    const server = new McpServer({
        name: "demo-server",
        version: "1.0.0",
        capabilities: {
            prompts: {}
        }
    });

    // Register tools and resources
    registerCreateUserTool(server);
    registerUsersResource(server);
    registerUserDetailsResource(server);

    // Start the server
    const transport = new StdioServerTransport();
    await server.connect(transport);
}

main().catch(console.error);