import {ImageRepository} from "../../database/repository/imageRepository.ts";
import {db} from "../../database/database.ts";
import {ImageForm} from "../imageController.ts";

const imageRepository = new ImageRepository(db)

export async function uploadImage(image: ImageForm) {
    const fileName = `${crypto.randomUUID()}-${image.imageData.name}`
    const filePath = `./uploads/${fileName}`;
    const fileSize = image.imageData.size
    const contentType = image.imageData.type

    const arrayBuffer = await image.imageData.arrayBuffer();
    await Deno.writeFile(filePath, new Uint8Array(arrayBuffer));

    await imageRepository.saveImage({
        fileName,
        filePath,
        fileSize,
        contentType,
    })
}