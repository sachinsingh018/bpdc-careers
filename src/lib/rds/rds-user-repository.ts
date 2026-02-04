/**
 * RDS User Repository
 * Implements UserRepository using Amazon RDS (MySQL/Aurora)
 */
import { query } from "@/lib/db/connection";
import type { Student } from "@/lib/domain/student";
import type { UserRepository } from "@/lib/persistence/user-repository";

export const rdsUserRepository: UserRepository = {
  async findByEmail(email: string): Promise<Student | null> {
    const rows = await query<{ id: string; email: string; created_at: Date }[]>(
      "SELECT id, email, created_at FROM students WHERE email = ?",
      [email]
    );
    const row = rows[0];
    return row
      ? { id: row.id, email: row.email, createdAt: new Date(row.created_at) }
      : null;
  },

  async findById(id: string): Promise<Student | null> {
    const rows = await query<{ id: string; email: string; created_at: Date }[]>(
      "SELECT id, email, created_at FROM students WHERE id = ?",
      [id]
    );
    const row = rows[0];
    return row
      ? { id: row.id, email: row.email, createdAt: new Date(row.created_at) }
      : null;
  },

  async save(student: Student): Promise<Student> {
    await query(
      "INSERT INTO students (id, email, created_at) VALUES (?, ?, ?)",
      [student.id, student.email, student.createdAt]
    );
    return student;
  },
};
