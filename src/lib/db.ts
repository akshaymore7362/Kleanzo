import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// Fix for SQLite Error Code 14 on Vercel Serverless Functions:
// In Vercel serverless lambdas, the root filesystem is read-only.
// Copy dev.db to /tmp/dev.db (writable) on cold boot if DATABASE_URL is not explicitly set.
if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
  try {
    const tmpDbPath = '/tmp/dev.db';
    if (!fs.existsSync(tmpDbPath)) {
      const candidates = [
        path.join(process.cwd(), 'prisma', 'dev.db'),
        path.join(process.cwd(), 'dev.db'),
      ];
      for (const src of candidates) {
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, tmpDbPath);
          break;
        }
      }
    }
    if (fs.existsSync(tmpDbPath)) {
      process.env.DATABASE_URL = 'file:/tmp/dev.db';
    }
  } catch (err) {
    console.error('[DB] Serverless SQLite copy error:', err);
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
