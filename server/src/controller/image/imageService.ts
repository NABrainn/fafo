export async function saveImage(file: File) {
    const decoder = new TextDecoder('utf-8');
    const path = Deno.cwd()
    const imageData =  await file.arrayBuffer();
    const imageBytes = new Uint8Array(imageData);

}

