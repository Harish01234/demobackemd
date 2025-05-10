import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.REDIS_URI_EXTERNAL) {
  throw new Error("REDIS_URI_EXTERNAL is not defined");
}

const client = createClient({
  url: process.env.REDIS_URI_EXTERNAL,
});

client.on("error", (err) => console.error("Redis Client Error", err));

await client.connect(); // Await properly

console.log("Redis Client Connected");

export default client;
