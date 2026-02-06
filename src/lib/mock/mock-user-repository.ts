/**
 * Mock User Repository - in-memory only (used when DATABASE_URL is not set)
 */
import type { Student } from "@/lib/domain/student";
import type { UserRepository, StudentWithPassword } from "@/lib/persistence/user-repository";

interface MockStudent extends Student {
  passwordHash?: string;
}

const users = new Map<string, MockStudent>();

export const mockUserRepository: UserRepository = {
  async findByEmail(email: string): Promise<Student | null> {
    const u = [...users.values()].find((u) => u.email === email);
    return u ? { id: u.id, email: u.email, createdAt: u.createdAt } : null;
  },
  async findByEmailForAuth(email: string): Promise<StudentWithPassword | null> {
    const u = [...users.values()].find((u) => u.email === email);
    return u
      ? { id: u.id, email: u.email, passwordHash: u.passwordHash ?? null }
      : null;
  },
  async findById(id: string): Promise<Student | null> {
    const u = users.get(id);
    return u ? { id: u.id, email: u.email, createdAt: u.createdAt } : null;
  },
  async save(student: Student, passwordHash?: string): Promise<Student> {
    const s: MockStudent = { ...student, passwordHash };
    users.set(student.id, s);
    return student;
  },

  async updatePassword(id: string, passwordHash: string): Promise<void> {
    const u = users.get(id);
    if (u) {
      u.passwordHash = passwordHash;
      users.set(id, u);
    }
  },
};
