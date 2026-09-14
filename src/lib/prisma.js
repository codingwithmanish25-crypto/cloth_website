import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

const connectionString = process.env.DATABASE_URL;

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
