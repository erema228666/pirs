import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { DefaultLogger, type LogWriter } from "drizzle-orm/logger";
import { logger } from "../logger"

const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const conn = globalForDb.conn ?? postgres(process.env.DATABASE_URL!);

class WinstonLogger implements LogWriter {
  write(message: string) {
    logger.info(message);
  }
}

export const db = drizzle(conn, {
  schema,
  logger: new DefaultLogger({ writer: new WinstonLogger() }),
});