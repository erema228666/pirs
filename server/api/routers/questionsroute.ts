import { z } from "zod";
import { questions, answers, files } from "../../db/schema";
import { auth } from "../../auth/auth";
import { db } from "../../db/index";
import { s3 } from "../../s3";
import Elysia from "elysia";
import { and, eq} from "drizzle-orm"

const answerMeta = z.object({
    text: z.string().min(1),
    isCorrect: z.boolean(),
});

const questionBody = z
    .object({
        type: z.enum(["quest", "test"]),
        text: z.string().min(1),
        answers: z
            .string()
            .transform((s, ctx) => {
                try {
                    return JSON.parse(s) as unknown;
                } catch {
                    ctx.addIssue({ code: "custom", message: "answers: невалидный JSON" });
                    return z.NEVER;
                }
            })
            .pipe(
                z
                    .array(answerMeta)
                    .min(2, "минимум 2 варианта")
                    .max(10, "максимум 10 вариантов")
                    .refine(
                        (arr) => arr.filter((a) => a.isCorrect).length === 1,
                        { message: "Должен быть ровно один правильный ответ" }
                    )
            ),

        answerFiles: z.array(z.file()).min(2).max(10),
    })
    .refine(
        (b) => b.answerFiles.length === (b.answers as unknown[]).length,
        { message: "Количество файлов должно совпадать с количеством ответов", path: ["answerFiles"] }
    );

export const questionsRouter = new Elysia({ prefix: "/questions" }).post(
    "/",
    async ({ body, request, set }) => {
        const session = await auth.api.getSession({ headers: request.headers });
        if (!session?.user || (session.user as any).role !== "admin") {
            set.status = 403;
            return { error: "Forbidden" };
        }

        const { type, text, answers: answerList, answerFiles } = body;

        let questionId: string | undefined;

        await db.transaction(async (tx) => {
            const [q] = await tx.insert(questions).values({ type, text }).returning();
            questionId = q.id;

            for (let i = 0; i < answerList.length; i++) {
                const meta = answerList[i];
                const file = answerFiles[i];

                const buf = Buffer.from(await file.arrayBuffer());
                const contentType = file.type || "application/octet-stream";

                const [f] = await tx
                    .insert(files)
                    .values({
                        fileName: file.name,
                        fileSize: buf.length,
                        contentType,
                        placeholder: undefined,
                    })
                    .returning();

                await s3.write(f.id, buf, { type: contentType });

                await tx.insert(answers).values({
                    questionId: q.id,
                    imageId: f.id,
                    text: meta.text,
                    isCorrect: meta.isCorrect,
                });
            }
        });

        const accept = request.headers.get("accept") ?? "";
        if (accept.includes("text/html")) {
            set.status = 303;
            set.headers["Location"] = "/admin";
            return;
        }

        set.status = 201;
        return { id: questionId };
    },
    { body: questionBody }
);