import {ImageRepository} from "../../database/repository/imageRepository.ts";
import {db} from "../../database/database.ts";
import {ImageForm} from "./imageController.ts";
import {join} from "node:path";
import {catchError} from "../../util/error.ts";

const imageRepository = new ImageRepository(db)


export async function uploadImage(image: ImageForm) {
    await Deno.mkdir(join('resources', 'blogPostImages'), { recursive: true });

    const fileName = `${crypto.randomUUID()}-${image.data.name}`
    const filePath = join('resources', 'blogPostImages', fileName);
    const fileSize = image.data.size
    const contentType = image.data.type

    const extensions = ["png", "jpg", "jpeg"];
    const ext = extensions.find(ext => contentType.endsWith(ext)) ?? 'png';

    const arrayBuffer = await image.data.arrayBuffer();
    const [writeErr] = await catchError(Deno.writeFile(filePath, new Uint8Array(arrayBuffer)))
    if(writeErr) {
        console.error('an error occurred writing image', writeErr)
    }
    const [dbErr,id] = await catchError(imageRepository.saveImage({
        fileName,
        filePath,
        fileSize,
        contentType,
        ext
    }))
    if(dbErr) {
        console.error('an error occurred uploading image', dbErr)
    }
    return id?.[0];
}