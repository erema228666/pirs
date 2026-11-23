import { z } from "zod";
import { blocks, files } from "../../db/schema";
import { auth } from "../../auth/auth";
import { db } from "../../db/index";
import { s3 } from "../../s3";
import Elysia from "elysia";
import { eq } from "drizzle-orm";

const blockBody = z.object({
    file: z.file(),
    text: z.string().min(1),
    questionsId: z.string().optional(),
});

export const blocksRouter = new Elysia({ prefix: "/blocks" })
    .post("/", async ({ body, request, set }) => {
        const session = await auth.api.getSession({ headers: request.headers });
        if (!session?.user || (session.user as any).role !== "admin") {
            set.status = 403;
            return { error: "Forbidden" };
        }

        const { file, text, questionsId } = body;
        const buf = Buffer.from(await file.arrayBuffer());
        const contentType = file.type || "application/octet-stream";

        let blockId: string | undefined;

        await db.transaction(async (tx) => {
            const [f] = await tx.insert(files).values({
                fileName: file.name,
                fileSize: buf.length,
                contentType,
                placeholder: undefined,
            }).returning();

            await s3.write(f.id, buf, { type: contentType });

            const [b] = await tx.insert(blocks).values({
                imageId: f.id,
                text,
                questionsId: questionsId ?? null,
            }).returning();

            blockId = b.id;
        });

        const accept = request.headers.get("accept") ?? "";
        if (accept.includes("text/html")) {
            set.status = 302;
            set.headers["Location"] = "/admin";
            return;
        }

        set.status = 201;
        return { id: blockId };
    }, { body: blockBody })

    .delete(
    "/:id",
    async ({ params }) => {
      await db.delete(blocks).where(eq(blocks.id, params.id));
    },
    {
      params: z.object({
        id: z.string(),
      }),
      hasRole: "admin",
    },
  );

    
    