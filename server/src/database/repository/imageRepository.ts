import {Connection} from "../database.ts";
import {Image, images} from "../schema/images.ts";
import {eq} from "npm:drizzle-orm@0.41.0";

export class ImageRepository {
    pool: Connection;

    constructor(pool: Connection) {
        this.pool = pool;
    }

    async saveImage(image: Extract<Image, typeof images.$inferInsert>) {
        return await this.pool
            .insert(images)
            .values(image)
            .returning({id: images.id})
    }

    async getImageById(id: number) {
        return await this.pool.query.images.findFirst({
            where: eq(images.id, id),
        })
    }
}