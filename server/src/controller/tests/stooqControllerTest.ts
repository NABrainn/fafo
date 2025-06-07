import { assertEquals } from "@std/assert/equals";
import { stooqController } from "../external/stooq/stooqController.ts";
import {__setQuotesForTesting} from "../external/stooq/stooqService.ts";

Deno.test("GET /public/quotes - returns data when quotes are available", async () => {
    __setQuotesForTesting([
        {
            name: "Test Spółka",
            ticker: "TST",
            date: "2025-06-07",
            time: "12:00:00",
            open: 100,
            high: 110,
            low: 95,
            close: 105,
            volume: 1000,
            change: 0.1,
            changePositive: true,
        },
    ]);

    const res = await stooqController.request("/public/quotes");
    const json = await res.json();

    assertEquals(res.status, 200);
    assertEquals(json.length, 1);
    assertEquals(json[0].ticker, "TST");
});

Deno.test("GET /public/quotes - returns 500 if no data", async () => {
    __setQuotesForTesting([]);

    const res = await stooqController.request("/public/quotes");
    const json = await res.json();

    assertEquals(res.status, 500);
    assertEquals(json.error, "Wystąpił błąd podczas pobierania danych");
});