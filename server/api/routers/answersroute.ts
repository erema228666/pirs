import { z } from "zod";
import { answers, files } from "../../db/schema";
import { auth } from "../../auth/auth";
import { db } from "../../db/index";
import { s3 } from "../../s3";
import Elysia from "elysia";
import { and, eq} from "drizzle-orm"


const answerBody = z.object({
    questionId: z.string().min(1),
    file: z.file(),
    text: z.string().min(1),
    isCorrect: z.boolean(),
});

export const answersRouter = new Elysia({ prefix: "/answers" })
    .post("/", async ({ body, request, set }) => {
        const session = await auth.api.getSession({ headers: request.headers });
        if (!session?.user || (session.user as any).role !== "admin") {
            set.status = 403;
            return { error: "Forbidden" };
        }

        const { questionId, file, text, isCorrect } = body;
        const buf = Buffer.from(await file.arrayBuffer());
        const contentType = file.type || "application/octet-stream";

        let answerId: string | undefined;

        try {
            await db.transaction(async (tx) => {
                if (isCorrect) {
                    const existing = await tx
                        .select({ id: answers.id })
                        .from(answers)
                        .where(and(
                            eq(answers.questionId, questionId),
                            eq(answers.isCorrect, true)
                        ))
                        .limit(1);
                    if (existing.length > 0) throw new Error("ONE_CORRECT_EXISTS");
                }

                const [f] = await tx.insert(files).values({
                    fileName: file.name,
                    fileSize: buf.length,
                    contentType,
                    placeholder: undefined,
                }).returning();

                await s3.write(f.id, buf, { type: contentType });

                const [a] = await tx.insert(answers).values({
                    questionId,
                    imageId: f.id,
                    text,
                    isCorrect,
                }).returning();

                answerId = a.id;
            });
        } catch (e) {
            if (e instanceof Error && e.message === "ONE_CORRECT_EXISTS") {
                set.status = 409;
                return { error: "У вопроса уже есть правильный ответ" };
            }
            throw e;
        }

        const accept = request.headers.get("accept") ?? "";
        if (accept.includes("text/html")) {
            set.status = 302;
            set.headers["Location"] = "/admin";
            return;
        }

        set.status = 201;
        return { id: answerId };
    }, { body: answerBody });