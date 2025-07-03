import { setupServer } from "./server.js";
import { initMongoConnection } from "./db/initMongoConnection.js";

async function startServer() {
    await initMongoConnection();
    setupServer();
}

startServer();
