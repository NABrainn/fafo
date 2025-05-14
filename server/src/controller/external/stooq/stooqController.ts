import { Hono } from "hono";
import {quotes} from "./stooqService.ts";

export const stooqController = new Hono();

stooqController.get("/public/quotes", (c) => {
    try {
        if(!quotes.length) return c.json({ error: 'Wystąpił błąd podczas pobierania danych'}, 500)
        return c.json(quotes, 200);
    } catch (err) {
        console.error("💥 Błąd podczas pobierania danych:", err);
        return c.json({ error: "Wystąpił błąd serwera" }, 500);
    }
});