export async function hashPassword(password: string): Promise<string> {
    const salt = crypto.getRandomValues(new Uint8Array(16))
    const passwordBuffer = new TextEncoder().encode(password);

    const baseKey = crypto.subtle.importKey(
        'raw',
        passwordBuffer,
        { name: 'PBKDF2' },
        false,
        ['deriveBits', 'deriveKey']
    )

    const hash = await crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt,
            iterations: 200000,
            hash: 'SHA-256',
        },
        await baseKey,
        256
    );

    const combined = new Uint8Array([...salt, ...new Uint8Array(hash)]);
    return btoa(String.fromCharCode(...combined));
}

export async function verifyPassword(password: string, storedHash: string) {
    try {
        const combined = Uint8Array.from(atob(storedHash), (c) => c.charCodeAt(0));
        const salt = combined.slice(0, 16);
        const originalHash = combined.slice(16);

        const passwordBuffer = new TextEncoder().encode(password);
        const baseKey = await crypto.subtle.importKey(
            'raw',
            passwordBuffer,
            { name: 'PBKDF2' },
            false,
            ['deriveBits', 'deriveKey']
        );

        const hash = await crypto.subtle.deriveBits(
            {
                name: 'PBKDF2',
                salt,
                iterations: 200000,
                hash: 'SHA-256',
            },
            baseKey,
            256
        );

        return new Uint8Array(hash).every((b, i) => b === originalHash[i]);
    } catch (e) {
        console.error('Password verification failed:', e);
        return false;
    }
}