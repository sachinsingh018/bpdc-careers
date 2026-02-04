/**
 * File Storage Interface
 * Abstract file uploads - swap implementation for Amazon S3 later
 * Handles profile photos and resume PDFs
 */
export interface FileStorage {
  uploadPhoto(file: File | Buffer, key: string): Promise<string>;
  uploadResume(file: File | Buffer, key: string): Promise<string>;
  getUrl(key: string): Promise<string>;
}
