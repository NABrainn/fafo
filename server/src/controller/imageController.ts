import {Hono} from "npm:hono@4.7.5";
import { assertEquals } from '@std/assert'
import { zValidator } from 'npm:@hono/zod-validator'
import { z } from 'zod'
import {uploadImage} from "./image/imageService.ts";
import {catchError} from "../util/error.ts";
import { assertNotEquals } from "@std/assert/not-equals";

export type ImageForm = {
    title: string,
    data: File
}

export const imageController = new Hono();

//obiekt który opisuje co i jak ma być walidowane
const schema = z.object({
    title: z.string().min(1, 'Tytuł musi mieć więcej niż 1 znak').max(100, 'Tytuł nie może być dłuższy niż 100 znaków'),
    data: z
        .instanceof(File)
        .refine(
            (file) => ['image/png', 'image/jpeg', 'image/gif'].includes(file.type),
            'Obrazek musi być w formacie PNG / JPEG / GIF',
        )
        .refine((file) => file.size <= 5 * 1024 * 1024, 'Obrazek musi być mniejszy niż 5MB'),
})

imageController.post(
    '/',
    zValidator('form', schema, (result, c) => {
        if (!result.success) {
            console.error("💥 Błąd podczas pobierania danych:", result.error.flatten());
            return c.json({
                error: 'Walidacja nie powiodła się', details: result.error.flatten()
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

//-------------------------------------TESTY------------------------------------------------
Deno.test('/api/images empty body | no File', async () => {
    const res = await imageController.request('/', {
        method: 'POST',
    })
    assertEquals(res.status, 400)
})

Deno.test('/api/images empty form data | no File', async () => {
    const request = new Request('http://localhost:8000/', {
        method: 'POST',
        body: new FormData()
    })

    const response = await imageController.fetch(request);
    assertEquals(response.status, 400)
})

Deno.test('/api/images form data invalid max len title | no File', async () => {
    const formData = new FormData()
    formData.set('title', 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz<<<<<zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz')
    const request = new Request('http://localhost:8000/', {
        method: 'POST',
        body: formData
    })

    const response = await imageController.fetch(request);
    assertEquals(response.status, 400)
})

Deno.test('/api/images form data invalid min len title | no File', async () => {
    const formData = new FormData()
    formData.set('title', '')
    const request = new Request('http://localhost:8000/', {
        method: 'POST',
        body: formData
    })

    const response = await imageController.fetch(request);
    assertEquals(response.status, 400)
})

Deno.test('/api/images invalid form data | invalid file type', async () => {
    const formData = new FormData()
    formData.set('title', '')
    formData.set('data', new File(['foo'], 'foo.txt'))
    const request = new Request('http://localhost:8000/', {
        method: 'POST',
        body: formData
    })

    const response = await imageController.fetch(request);
    assertEquals(response.status, 400)
})

Deno.test('/api/images valid form data | invalid file size', async () => {
    const formData = new FormData()
    //20mb size
    const file = new File([new Uint8Array(21000000)], 'foo.png', {
        type: 'image/png'
    })
    formData.set('title', 'zz')
    formData.set('data', file)
    const request = new Request('http://localhost:8000/', {
        method: 'POST',
        body: formData
    })

    const response = await imageController.fetch(request);
    assertEquals(response.status, 400)
})

Deno.test('/api/images valid form data | valid file', async () => {
    const formData = new FormData()
    //20mb size
    const file = new File([new Uint8Array(21000)], 'foo.png', {
        type: 'image/png'
    })
    formData.set('title', 'zz')
    formData.set('data', file)
    const request = new Request('http://localhost:8000/', {
        method: 'POST',
        body: formData
    })

    const response = await imageController.fetch(request);
    assertNotEquals(response.status, 400)
})
