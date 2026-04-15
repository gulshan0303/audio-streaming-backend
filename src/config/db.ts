import { PrismaClient as BasePrismaClient } from "@prisma/client";

type PrismaClient = BasePrismaClient;

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ||
  new BasePrismaClient({
    log: ["query"], // dev me queries dikhenge
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
