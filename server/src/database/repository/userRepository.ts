import { User, users } from "../schema/users.ts";
import { db } from "../db.ts";
import { eq } from "drizzle-orm/expressions";

export class UserRepository {

  pool!: typeof db;

  constructor(pool: typeof db) {
    this.pool = pool;
  }
  
  async findById(id: number) {
    const found = await this.pool.select().from(users).where(eq(users.id, id));
    return found[0];
  }

  async findAll() {
    return await this.pool.select().from(users);
  }
  async create(data: Extract<User, typeof users.$inferInsert>) {
    const created = await this.pool.insert(users).values(data).returning();
    return created[0];
  }
  async updateById(id: number, data: User) {
    const updated = await this.pool.update(users).set(data).where(eq(users.id, id)).returning();
    return updated[0];
  }
  async deleteById(id: number) {
    return await this.pool.delete(users).where(eq(users.id, id));

  }
  async findByEmail(email: string) {
    const found = await this.pool.select().from(users).where(eq(users.email, email));
    return found[0]
  }
  async verifyUser(id: number) {
    const verified = await this.pool.update(users).set({verified: true}).where(eq(users.id, id)).returning()
    return verified[0]
  }
}