/**
 * S3 File Storage
 * Implements FileStorage using Amazon S3
 * Uses env: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, S3_BUCKET_NAME
 */
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import type { FileStorage } from "@/lib/storage/file-storage";

function getS3Client(): S3Client | null {
  if (!process.env.S3_BUCKET_NAME || !process.env.AWS_REGION) return null;
  return new S3Client({
    region: process.env.AWS_REGION,
    credentials:
      process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
        ? {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        }
        : undefined,
  });
}

async function fileToBuffer(file: File | Buffer): Promise<Buffer> {
  if (Buffer.isBuffer(file)) return file;
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

function getContentType(file: File | Buffer): string {
  if (Buffer.isBuffer(file)) return "application/octet-stream";
  return (file as File).type || "application/octet-stream";
}

export const s3FileStorage: FileStorage = {
  async uploadPhoto(file: File | Buffer, key: string): Promise<string> {
    const client = getS3Client();
    if (!client) throw new Error("S3 not configured. Set S3_BUCKET_NAME and AWS_REGION.");

    const body = await fileToBuffer(file);
    const s3Key = `photos/${key}`;

    await client.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: s3Key,
        Body: body,
        ContentType: getContentType(file),
      })
    );

    return `/api/file/${s3Key}`;
  },

  async uploadResume(file: File | Buffer, key: string): Promise<string> {
    const client = getS3Client();
    if (!client) throw new Error("S3 not configured. Set S3_BUCKET_NAME and AWS_REGION.");

    const body = await fileToBuffer(file);
    const s3Key = `resumes/${key}`;

    await client.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: s3Key,
        Body: body,
        ContentType: getContentType(file),
      })
    );

    return `/api/file/${s3Key}`;
  },

  async getUrl(key: string): Promise<string> {
    return `/api/file/${key}`;
  },
};
