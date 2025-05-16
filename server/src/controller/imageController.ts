import {Hono} from "npm:hono@4.7.5";
import { assertEquals } from '@std/assert'
import { zValidator } from 'npm:@hono/zod-validator'
import { z } from 'zod'
import {uploadImage} from "./image/imageService.ts";
import {catchError} from "../util/error.ts";

export type ImageForm = {
    title: string,
    data: File
}

export const imageController = new Hono();

//obiekt który opisuje co i jak ma być walidowane
const schema = z.object({
    title: z.string().min(1).max(100),
    data: z
        .instanceof(File)
        .refine(
            (file) => ['image/png', 'image/jpeg', 'image/gif'].includes(file.type),
            'Image must be PNG, JPEG, or GIF',
        )
        .refine((file) => file.size <= 5 * 1024 * 1024, 'Image must be ≤ 5MB'),
})

imageController.post(
    '/',
    zValidator('form', schema, (result, c) => {
        if (!result.success) {
            return c.json({
                error: 'Validation failed', details: result.error.flatten()
            }, 400);
        }
    }),
    async c => {
        const image: ImageForm = c.req.valid('form')
        const [err] = await catchError(uploadImage(image));
        if(err) {
            console.error("💥 Błąd podczas pobierania danych:", err);
            return c.json({ error: "Wystąpił błąd serwera" }, 500);
        }
})

Deno.test('/api/images no body', async () => {
    const res = await imageController.request('/', {
        method: 'POST',
    })
    assertEquals(res.status, 400)
})
