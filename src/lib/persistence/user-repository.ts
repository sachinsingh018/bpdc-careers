/**
 * User (Student) Repository Interface
 * Abstract persistence - swap implementation for Amazon RDS later
 */
import type { Student } from "@/lib/domain/student";

export interface UserRepository {
  findByEmail(email: string): Promise<Student | null>;
  findById(id: string): Promise<Student | null>;
  save(student: Student): Promise<Student>;
}
