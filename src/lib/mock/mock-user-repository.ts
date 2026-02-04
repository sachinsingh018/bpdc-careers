/**
 * Mock User Repository
 * In-memory storage for MVP
 * TODO: Replace with Amazon RDS implementation - use UserRepository interface
 */
import type { Student } from "@/lib/domain/student";
import type { UserRepository } from "@/lib/persistence/user-repository";

const users = new Map<string, Student>();

export const mockUserRepository: UserRepository = {
  async findByEmail(email: string): Promise<Student | null> {
    return [...users.values()].find((u) => u.email === email) ?? null;
  },
  async findById(id: string): Promise<Student | null> {
    return users.get(id) ?? null;
  },
  async save(student: Student): Promise<Student> {
    users.set(student.id, student);
    return student;
  },
};
