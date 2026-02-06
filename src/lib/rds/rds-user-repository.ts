/**
 * User Repository - Neon (PostgreSQL)
 */
import { query } from "@/lib/db/connection";
import type { Student } from "@/lib/domain/student";
import type { UserRepository, StudentWithPassword } from "@/lib/persistence/user-repository";

export const rdsUserRepository: UserRepository = {
  async findByEmail(email: string): Promise<Student | null> {
    const rows = await query<{ id: string; email: string; created_at: Date }[]>(
      "SELECT id, email, created_at FROM students WHERE email = $1",
      [email]
    );
    const row = rows[0];
    return row
      ? { id: row.id, email: row.email, createdAt: new Date(row.created_at) }
      : null;
  },

  async findByEmailForAuth(email: string): Promise<StudentWithPassword | null> {
    const rows = await query<
      { id: string; email: string; password_hash: string | null }[]
    >(
      "SELECT id, email, password_hash FROM students WHERE email = $1",
      [email]
    );
    const row = rows[0];
    return row
      ? {
          id: row.id,
          email: row.email,
          passwordHash: row.password_hash,
        }
      : null;
  },

  async findById(id: string): Promise<Student | null> {
    const rows = await query<{ id: string; email: string; created_at: Date }[]>(
      "SELECT id, email, created_at FROM students WHERE id = $1",
      [id]
    );
    const row = rows[0];
    return row
      ? { id: row.id, email: row.email, createdAt: new Date(row.created_at) }
      : null;
  },

  async save(student: Student, passwordHash?: string): Promise<Student> {
    await query(
      "INSERT INTO students (id, email, password_hash, created_at) VALUES ($1, $2, $3, $4)",
      [student.id, student.email, passwordHash ?? null, student.createdAt]
    );
    return student;
  },

  async updatePassword(id: string, passwordHash: string): Promise<void> {
    await query(
      "UPDATE students SET password_hash = $1 WHERE id = $2",
      [passwordHash, id]
    );
  },
};
