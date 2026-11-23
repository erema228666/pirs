import { S3Client } from "bun";

const globalForS3 = globalThis as unknown as {
    s3: S3Client | undefined;
};

export const s3 =
    globalForS3.s3 ??
    new S3Client({
        region: process.env.S3_REGION ?? "us-east-1",
        endpoint: process.env.S3_ENDPOINT ?? "http://localhost:9000",
        accessKeyId: process.env.S3_ACCESS_KEY ?? "minioadmin",
        secretAccessKey: process.env.S3_SECRET_KEY ?? "minioadmin",
        bucket: process.env.S3_BUCKET ?? "profbucket",
    });

if (process.env.NODE_ENV !== "production") globalForS3.s3 = s3;