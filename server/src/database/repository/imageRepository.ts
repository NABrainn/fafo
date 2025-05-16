import {Connection} from "../database.ts";
import {Image, images} from "../schema/images.ts";

export class ImageRepository {
    pool!: Connection;

    constructor(pool: Connection) {
        this.pool = pool;
    }

    async saveImage(image: Extract<Image, typeof images.$inferInsert>) {
        return await this.pool
            .insert(images)
            .values(image)
    }
}