/**
 * File proxy - generates presigned S3 URLs and redirects
 * Enables private bucket while serving photos/resumes to profile viewers
 */
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";

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

export async function GET(
  _req: NextRequest,
  { params }: { params: { key?: string[] } }
) {
  const { key } = params;
  const s3Key = key?.join("/");
  if (!s3Key) {
    return NextResponse.json({ error: "Missing key" }, { status: 400 });
  }

  const client = getS3Client();
  if (!client) {
    return NextResponse.json({ error: "S3 not configured" }, { status: 503 });
  }

  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: s3Key,
  });

  const url = await getSignedUrl(client, command, { expiresIn: 3600 });
  return NextResponse.redirect(url);
}
