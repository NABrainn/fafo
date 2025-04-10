import { User, users } from "../schema/users.ts";
import { Connection } from "../db.ts";
import { eq } from "drizzle-orm/expressions";

export class UserRepository {

    pool!: Connection;

    constructor(pool: Connection) {
      this.pool = pool;
    }
    async findById(id: number) {
        return await this.pool.query.users.findFirst({
            where: eq(users.id, id),
            with: {
                comments: true,
                blogPosts: true
            }
        })
    }
    async findAll() {
        return await this.pool.query.users.findMany({
            with: {
                comments: true,
                blogPosts: true
            }
        })    
    }
    async create(data: Extract<User, typeof users.$inferInsert>) {
        const created = await this.pool.insert(users).values(data).returning();
        return created[0];
    }
    async updateById(id: number, data: Extract<User, typeof users.$inferInsert>) {
        const updated = await this.pool.update(users).set(data).where(eq(users.id, id)).returning();
        return updated[0];
    }
    async deleteById(id: number) {
        return await this.pool.delete(users).where(eq(users.id, id));

    }
    async findByEmail(email: string) {
        return await this.pool.query.users.findFirst({
            where: eq(users.email, email),
            with: {
                comments: true,
                blogPosts: true
            }
        })
    }
    async verifyUser(id: number) {
        const verified = await this.pool.update(users).set({
            verified: true
        }).where(eq(users.id, id)).returning()
        return verified[0]
    }
}
