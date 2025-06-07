import {Context} from "npm:hono@4.7.5";

interface MockContextOptions {
    method?: string;
    path?: string;
    body?: unknown;
    params?: Record<string, string>;
    jwtPayload?: unknown;
}

export const createMockContext = <T = unknown>({
      method = "GET",
      path = "/",
      body = {},
      params = {},
      jwtPayload,
}: MockContextOptions = {}): Context => ({
    req: {
        method,
        url: `http://localhost:8000${path}`,
        param: (key: string) => params[key],
        json: async () => body,
    },
    get: (key: string) => (key === "jwtPayload" ? jwtPayload : undefined),
    json: (data: T, status: number = 200) => new Response(JSON.stringify(data), { status }),
} as Context);