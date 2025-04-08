import { User, users } from "../schema/users.ts";
import { CrudRepository } from "./crudRepository.ts";
import { db } from "../db.ts";
import { eq } from "drizzle-orm/expressions";

interface UserRepository extends CrudRepository<User> {
  findByEmail(email: string): Promise<User>,
  verifyUser(id: number):  Promise<User>
}

export const userRepository: UserRepository = {
  findById: async (id: number) => {
    const found = await db.select().from(users).where(eq(users.id, id));
    return found[0];
  },
  findAll: async () => {
    return await db.select().from(users);
  },
  create: async (data: User) => {
    const created = await db.insert(users).values(data).returning();
    return created[0];
  },
  updateById: async (id: number, data: User) => {
    const updated = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return updated[0];
  },
  deleteById: async (id: number) => {
    return await db.delete(users).where(eq(users.id, id));
  },
  findByEmail: async (email: string): Promise<User> => {
    const found = await db.select().from(users).where(eq(users.email, email));
    return found[0]
  },
  verifyUser: async (id: number): Promise<User> => {
    const verified = await db.update(users).set({verified: true}).where(eq(users.id, id)).returning()
    return verified[0]
  }
}