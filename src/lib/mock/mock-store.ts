/**
 * File-backed mock store so dev server restarts don't lose auth/profile data.
 * Only used when RDS is not configured.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type { Profile } from "@/lib/domain/profile";
import type { Student } from "@/lib/domain/student";

const DATA_DIR = join(process.cwd(), ".data");
const STORE_PATH = join(DATA_DIR, "mock-store.json");

interface StoreData {
  users: Array<Omit<Student, "createdAt"> & { createdAt: string }>;
  profiles: Array<Omit<Profile, "createdAt" | "updatedAt"> & { createdAt: string; updatedAt: string }>;
}

function ensureDir() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

function load(): StoreData {
  ensureDir();
  if (!existsSync(STORE_PATH)) {
    return { users: [], profiles: [] };
  }
  try {
    const raw = readFileSync(STORE_PATH, "utf-8");
    return JSON.parse(raw) as StoreData;
  } catch {
    return { users: [], profiles: [] };
  }
}

function save(data: StoreData) {
  ensureDir();
  writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export function loadUsers(): Map<string, Student> {
  const data = load();
  const map = new Map<string, Student>();
  for (const u of data.users) {
    map.set(u.id, { ...u, createdAt: new Date(u.createdAt) });
  }
  return map;
}

export function saveUsers(users: Map<string, Student>) {
  const data = load();
  data.users = [...users.values()].map((u) => ({ ...u, createdAt: u.createdAt.toISOString() }));
  save(data);
}

export function loadProfiles(): { byId: Map<string, Profile>; byStudentId: Map<string, string> } {
  const data = load();
  const byId = new Map<string, Profile>();
  const byStudentId = new Map<string, string>();
  for (const p of data.profiles) {
    const profile: Profile = {
      ...p,
      createdAt: new Date(p.createdAt),
      updatedAt: new Date(p.updatedAt),
    };
    byId.set(profile.id, profile);
    byStudentId.set(profile.studentId, profile.id);
  }
  return { byId, byStudentId };
}

export function saveProfiles(byId: Map<string, Profile>, byStudentId: Map<string, string>) {
  const data = load();
  data.profiles = [...byId.values()].map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));
  save(data);
}
