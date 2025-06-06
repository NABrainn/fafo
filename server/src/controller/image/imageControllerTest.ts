import {imageController} from "./imageController.ts";
import { assertNotEquals } from "@std/assert/not-equals";
import { assertEquals } from '@std/assert'


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