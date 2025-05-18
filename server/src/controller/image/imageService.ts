import {ImageRepository} from "../../database/repository/imageRepository.ts";
import {db} from "../../database/database.ts";
import {ImageForm} from "./imageController.ts";
import {resolve} from "node:path";
const imageRepository = new ImageRepository(db)
const filePath = resolve(Deno.cwd(), '../resources/blogPostImages');

export async function uploadImage(image: ImageForm) {
    const fileName = `${crypto.randomUUID()}-${image.data.name}`
    const fileSize = image.data.size
    const contentType = image.data.type

    const extensions = ["png", "jpg", "jpeg"];
    const ext = extensions.find(ext => contentType.endsWith(ext)) ?? 'png';

    const arrayBuffer = await image.data.arrayBuffer();
    await Deno.writeFile(`${filePath}/${fileName}`, new Uint8Array(arrayBuffer));

    await imageRepository.saveImage({
        fileName,
        filePath,
        fileSize,
        contentType,
        ext
    })
}