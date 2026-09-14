import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error(
    "Database connection is not configured. Set DATABASE_URL in the Vercel project environment variables.",
  );
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const cachedPrisma = globalForPrisma.prisma;
const hasCurrentSchema =
  cachedPrisma && typeof cachedPrisma.contactMessage?.findMany === "function";

export const prisma = hasCurrentSchema
  ? cachedPrisma
  : new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Default Export add kiya taaki "Cannot read properties of undefined" dubara na aaye
export default prisma;
