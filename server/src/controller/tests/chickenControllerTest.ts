import { assertEquals } from "@std/assert/equals";
import { createChickenControllerTest } from "../external/chickenFacts/chickenController.ts";
import type { Fact, CountResponse } from "../external/chickenFacts/chickenModel.ts";

Deno.test("GET /public/facts - returns fact and count", async () => {
    const mockFact: Fact = {
        id: 1,
        fact: "Kury potrafią śpiewać.",
        source: "Źródło A",
        published: "2024-01-01"
    };

    const mockCount: CountResponse = {
        count: 42,
        last_counted: "2024-06-07T00:00:00Z"
    };

    const app = createChickenControllerTest({
        getFactById: async () => mockFact,
        getFactCount: async () => mockCount
    });

    const res = await app.request("/public/facts");
    const json = await res.json();

    assertEquals(res.status, 200);
    assertEquals(json.fact.fact, "Kury potrafią śpiewać.");
    assertEquals(json.count, 42);
});

Deno.test("GET /public/facts - handles errors gracefully", async () => {
    const app = createChickenControllerTest({
        getFactById: async () => { throw new Error("fail"); },
        getFactCount: async () => { throw new Error("fail"); }
    });

    const res = await app.request("/public/facts");
    const json = await res.json();

    assertEquals(res.status, 200);
    assertEquals(json.fact, undefined);
    assertEquals(json.count, undefined);
});