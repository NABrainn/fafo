import { Context } from "npm:hono@4.7.5";

interface MockContextOptions {
    method?: string;
    path?: string;
    body?: unknown;
    params?: Record<string, string>;
    jwtPayload?: unknown;
    cookies?: Record<string, string>;
}

export const createMockContext = <T = unknown>({
                                                   method = "GET",
                                                   path = "/",
                                                   body = {},
                                                   params = {},
                                                   jwtPayload,
                                                   cookies = {},
                                               }: MockContextOptions = {}): Context<any, any, {}> => {
    const cookieStore: Record<string, string> = { ...cookies };
    const headers: Headers = new Headers();

    return {
        req: {
            method,
            url: `http://localhost:8000${path}`,
            param: (key: string) => params[key],
            json: async () => body,
            raw: {
                headers: new Headers(
                    Object.entries(cookieStore).length
                        ? { Cookie: Object.entries(cookieStore).map(([k, v]) => `${k}=${v}`).join("; ") }
                        : {},
                ),
            } as Request,
        },
        get: (key: string) => (key === "jwtPayload" ? jwtPayload : undefined),
        json: (data: T, status: number = 200) => {
            const response = new Response(JSON.stringify(data), { status, headers });
            (response as any).__cookies = cookieStore;
            return response;
        },
        setCookie: (name: string, value: string, options: any) => {
            cookieStore[name] = value;
            let cookieString = `${name}=${value}`;
            if (options?.maxAge) cookieString += `; Max-Age=${options.maxAge}`;
            if (options?.path) cookieString += `; Path=${options.path}`;
            if (options?.sameSite) cookieString += `; SameSite=${options.sameSite}`;
            if (options?.httpOnly) cookieString += `; HttpOnly`;
            if (options?.secure) cookieString += `; Secure`;
            headers.append("Set-Cookie", cookieString);
        },
        getCookie: (name: string) => cookieStore[name] || undefined,
        header: (name: string, value: string) => {
            headers.set(name, value);
        },
    } as unknown as Context<any, any, {}>;
};