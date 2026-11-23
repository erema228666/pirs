import { db } from "../db";
import { files } from "../db/schema";
import { s3 } from "../s3";
import Elysia from "elysia";
import { z } from "zod/v4";

export async function UploadFile({ file }: { file: File }) {
    const arrayBuffer = await file.arrayBuffer();
    const buf: Buffer = Buffer.from(arrayBuffer);

    const resolvedMimeType: string =
        file.type || "application/octet-stream";

    let id: string | undefined;

    await db.transaction(async (tx) => {
        const [f] = await tx.insert(files).values({
            fileName: file.name,
            fileSize: buf.length,
            contentType: resolvedMimeType,
            placeholder: undefined,
        }).returning();

        id = f.id;

        await s3.write(id!, buf, { type: resolvedMimeType });
    });

    return id;
}

export const fileRouter = new Elysia({ prefix: "/file" })
    .post("/", async ({ body }) => {
        const id = await UploadFile({ file: body.file });
        return id;
    }, {
        body: z.object({ file: z.file() })
    })
    .get("/", async () => {
        return await db.select({ id: files.id }).from(files);
    });