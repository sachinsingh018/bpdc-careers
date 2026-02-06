/**
 * User (Student) Repository Interface
 */
import type { Student } from "@/lib/domain/student";

export interface StudentWithPassword {
  id: string;
  email: string;
  passwordHash: string | null;
}

export interface UserRepository {
  findByEmail(email: string): Promise<Student | null>;
  findByEmailForAuth(email: string): Promise<StudentWithPassword | null>;
  findById(id: string): Promise<Student | null>;
  save(student: Student, passwordHash?: string): Promise<Student>;
  updatePassword(id: string, passwordHash: string): Promise<void>;
}
