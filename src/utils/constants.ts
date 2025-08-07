import path from "path";

// Server Configuration
export const SERVER_CONFIG = {
    NAME: "demo-server",
    VERSION: "1.0.0",
    CAPABILITIES: {
        prompts: {}
    }
};

// Resource URIs
export const RESOURCE_URIS = {
    USERS: "users://all",
    USER_DETAILS: "users://{id}"
};

// Resource Titles and Descriptions
export const RESOURCE_METADATA = {
    USERS: {
        TITLE: "Users",
        DESCRIPTION: "Get all users from data store",
        MIMETYPE: "application/json"
    },
    USER_DETAILS: {
        TITLE: "User Details",
        DESCRIPTION: "Get user details by ID",
        MIMETYPE: "application/json"
    }
};

// Tool Metadata
export const TOOL_METADATA = {
    CREATE_USER: {
        TITLE: "Create User",
        DESCRIPTION: "Creates a user with name, email, phone, and address."
    }
};

// File Paths
export const PATHS = {
    DATA_DIR: path.resolve(__dirname, "../data"),
    USER_DATA: path.resolve(__dirname, "../data/user.json")
};

// Error Messages
export const ERROR_MESSAGES = {
    USER_NOT_FOUND: (id: string) => `User with ID ${id} not found.`,
    INVALID_USER_ID: "User ID is required"
};