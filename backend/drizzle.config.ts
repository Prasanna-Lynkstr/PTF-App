// drizzle.config.ts
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/schema", // folder where your table schemas will be
  out: "./drizzle",       // folder where migrations will be stored
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;