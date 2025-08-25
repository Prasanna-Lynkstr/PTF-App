import dotenv from "dotenv";
dotenv.config();

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";


const client = postgres(process.env.DATABASE_URL!); // .env should have DATABASE_URL
console.log("DATABASE_URL:", process.env.DATABASE_URL);
export const db = drizzle(client);