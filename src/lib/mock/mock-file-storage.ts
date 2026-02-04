/**
 * Mock File Storage
 * Uses base64 data URLs for MVP - replace with S3 implementation later
 * TODO: Replace with Amazon S3 - upload photos to S3 bucket, return presigned/public URLs
 */
import type { FileStorage } from "@/lib/storage/file-storage";

const storage = new Map<string, string>();

async function fileToDataUrl(file: File | Buffer): Promise<string> {
  if (Buffer.isBuffer(file)) {
    return `data:application/octet-stream;base64,${file.toString("base64")}`;
  }
  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  const mime = file.type || "application/octet-stream";
  return `data:${mime};base64,${base64}`;
}

export const mockFileStorage: FileStorage = {
  async uploadPhoto(file: File | Buffer, key: string): Promise<string> {
    const dataUrl = await fileToDataUrl(file);
    storage.set(`photo/${key}`, dataUrl);
    return dataUrl;
  },
  async uploadResume(file: File | Buffer, key: string): Promise<string> {
    const dataUrl = await fileToDataUrl(file);
    storage.set(`resume/${key}`, dataUrl);
    return dataUrl;
  },
  async getUrl(key: string): Promise<string> {
    const photoUrl = storage.get(`photo/${key}`);
    const resumeUrl = storage.get(`resume/${key}`);
    return (photoUrl ?? resumeUrl) ?? "";
  },
};
