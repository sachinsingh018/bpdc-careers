/**
 * File storage factory - uses S3 when configured, else mock
 * Set S3_BUCKET_NAME and AWS_REGION to enable S3
 */
import { mockFileStorage } from "@/lib/mock/mock-file-storage";
import { s3FileStorage } from "@/lib/storage/s3-file-storage";
import type { FileStorage } from "@/lib/storage/file-storage";

function useS3(): boolean {
  return !!(process.env.S3_BUCKET_NAME && process.env.AWS_REGION);
}

export const fileStorage: FileStorage = useS3() ? s3FileStorage : mockFileStorage;
