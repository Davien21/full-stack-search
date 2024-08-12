import Typesense from "typesense";

const env = {
  TYPESENSE_HOST: "grak42xdty07u85cp-1.a1.typesense.net",
  TYPESENSE_PORT: 443,
  TYPESENSE_PROTOCOL: "https",
  TYPESENSE_API_KEY: "G9EKuX4PHWNueZmaIcqjcCDGBXGie1rl",
};

// Initialize the Typesense client
const typesenseClient = new Typesense.Client({
  nodes: [
    {
      host: env.TYPESENSE_HOST,
      port: env.TYPESENSE_PORT,
      protocol: env.TYPESENSE_PROTOCOL,
    },
  ],
  apiKey: env.TYPESENSE_API_KEY,
  connectionTimeoutSeconds: 2,
});

export { typesenseClient };

// Define the schema for your collections
