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
            console.error("💥 Błąd podczas pobierania danych:", result.error.flatten());
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

Deno.test('/api/images empty body', async () => {
    const res = await imageController.request('/', {
        method: 'POST',
    })
    assertEquals(res.status, 400)
})

Deno.test('/api/images empty form data', async () => {
    const request = new Request('http://localhost:8000/', {
        method: 'POST',
        body: new FormData()
    })

    const response = await imageController.fetch(request);
    assertEquals(response.status, 400)
})

Deno.test('/api/images form data invalid max len title', async () => {
    const formData = new FormData()
    formData.set('title', 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz<<<<<zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz')
    const request = new Request('http://localhost:8000/', {
        method: 'POST',
        body: new FormData()
    })

    const response = await imageController.fetch(request);
    assertEquals(response.status, 400)
})

Deno.test('/api/images form data invalid min len title', async () => {
    const formData = new FormData()
    formData.set('title', '')
    const request = new Request('http://localhost:8000/', {
        method: 'POST',
        body: new FormData()
    })

    const response = await imageController.fetch(request);
    assertEquals(response.status, 400)
})
