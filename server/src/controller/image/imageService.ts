import {ImageRepository} from "../../database/repository/imageRepository.ts";
import {db} from "../../database/database.ts";
import {ImageForm} from "../imageController.ts";

const imageRepository = new ImageRepository(db)

export async function uploadImage(image: ImageForm) {
    const fileName = `${crypto.randomUUID()}-${image.data.name}`
    const filePath = `./uploads/${fileName}`;
    const fileSize = image.data.size
    const contentType = image.data.type

    const arrayBuffer = await image.data.arrayBuffer();
    await Deno.writeFile(filePath, new Uint8Array(arrayBuffer));

    await imageRepository.saveImage({
        fileName,
        filePath,
        fileSize,
        contentType,
    })
}