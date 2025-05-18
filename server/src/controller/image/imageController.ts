import {Hono} from "npm:hono@4.7.5";
import { zValidator } from 'npm:@hono/zod-validator'
import { z } from 'zod'
import {uploadImage} from "./imageService.ts";
import {catchError} from "../../util/error.ts";
import {ImageRepository} from "../../database/repository/imageRepository.ts";
import {db} from "../../database/database.ts";

export type ImageForm = {
    title: string,
    data: File
}

const imageRepository = new ImageRepository(db)
export const imageController = new Hono();


const getImageSchema = z.object({
    id: z.string().regex(/^\d+$/).transform(Number).pipe(z.number().positive().int()),
});

imageController.get(
    '/public/:id',
    zValidator('param', getImageSchema, (result, c) => {
        if (!result.success) {
            console.error("💥 Błąd podczas pobierania danych:", result.error.flatten());
            return c.json({
                error: 'Walidacja nie powiodła się', details: result.error.flatten()
            }, 400);
        }
    }),
    async c => {
    const getImageSchema = c.req.valid('param')
    const [dbErr, imageProps] = await catchError(imageRepository.getImageById(getImageSchema.id));
    if(dbErr) {
        console.error("💥 Błąd podczas pobierania danych:", dbErr);
        return c.json({ error: "Wystąpił błąd serwera" }, 500);
    }
    let filePath = ''
    if(!imageProps?.filePath.endsWith(imageProps.ext)) {
        filePath = `${Deno.cwd()}/${imageProps?.filePath}.${imageProps?.ext}`;
    }
    else {
        filePath = `${Deno.cwd()}/${imageProps?.filePath}`;
    }
    const [notFoundErr] = await catchError(Deno.stat(filePath));
    if(notFoundErr) {
        console.error("💥 Nie znaleziono obrazka:", notFoundErr);
        return c.json({ error: "Nie znaleziono obrazka na dysku" }, 404);
    }
    const [imageErr, image] = await catchError(Deno.readFile(filePath));
    if(imageErr) {
        console.error("💥 Błąd podczas pobierania danych:", dbErr);
        return c.json({ error: "Wystąpił błąd serwera" }, 500);
    }
    c.header("Content-Type", imageProps?.contentType);
    return c.body(image, 200)
})

const postImageSchema = z.object({
    title: z.string().min(1, 'Tytuł musi mieć więcej niż 1 znak').max(100, 'Tytuł nie może być dłuższy niż 100 znaków'),
    data: z
        .instanceof(File)
        .refine(
            (file) => ['image/png', 'image/jpeg'].includes(file.type),
            'Obrazek musi być w formacie PNG / JPEG / GIF',
        )
        .refine((file) => file.size <= 5 * 1024 * 1024, 'Obrazek musi być mniejszy niż 5MB'),
})

imageController.post(
    '/',
    zValidator('form', postImageSchema, (result, c) => {
        if (!result.success) {
            console.error("💥 Błąd podczas pobierania danych:", result.error.flatten());
            return c.json({
                error: 'Walidacja nie powiodła się', details: result.error.flatten()
            }, 400);
        }
    }),
    async c => {
        const image: ImageForm = c.req.valid('form')
        const [err, savedImage] = await catchError(uploadImage(image));
        if(err) {
            console.error("💥 Błąd podczas pobierania danych:", err);
            return c.json({ error: "Wystąpił błąd serwera" }, 500);
        }
        return c.json(savedImage?.id, 200)
})
