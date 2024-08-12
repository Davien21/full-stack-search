import Typesense from "typesense";
import { env } from "@/config/env";

// Initialize the Typesense client
const typesenseClient = new Typesense.Client({
  nodes: [
    {
      host: env.TYPESENSE_HOST,
      port: env.TYPESENSE_PORT,
      protocol: env.TYPESENSE_PROTOCOL,
    },
  ],
  apiKey: env.TYPESENSE_ADMIN_API_KEY,
  connectionTimeoutSeconds: 2,
});

export default typesenseClient;

// Define the schema for your collections
