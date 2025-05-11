import { StockQuote } from "./StooqApiModel.ts";
import { Hono } from "hono";

const companyList = [
    { name: "Grupa Azoty", ticker: "ATT" },
    { name: "Ciech", ticker: "CIE" },
    { name: "Kernel", ticker: "KER" },
    { name: "Agroliga", ticker: "AGR" },
    { name: "Wielton", ticker: "WLT" },
    { name: "Gobarto", ticker: "GOB" },
];

export async function getStockQuotes(): Promise<StockQuote[]> {
    const results: StockQuote[] = [];

    for (const company of companyList) {
        const url = `https://stooq.pl/q/l/?s=${company.ticker}&f=sd2t2ohlcv&h&e=json`;
        const response = await fetch(url);

        if (!response.ok) {
            console.warn(`⚠️ Błąd HTTP dla: ${company.ticker}`);
            continue;
        }

        const json = await response.json();

        const symbolData = json.symbols?.[0];
        if (!symbolData || symbolData.close === null) {
            console.warn(`⚠️ Brak danych giełdowych dla: ${company.ticker}`);
            continue;
        }

        results.push({
            name: company.name,
            ticker: company.ticker,
            date: symbolData.date,
            time: symbolData.time,
            open: symbolData.open,
            high: symbolData.high,
            low: symbolData.low,
            close: symbolData.close,
            volume: symbolData.volume,
        });
    }

    return results;
}

export const stooqApiController = new Hono();

stooqApiController.get("/quotes", async (c) => {
    try {
        const quotes = await getStockQuotes();
        return c.json(quotes);
    } catch (err) {
        console.error("💥 Błąd podczas pobierania danych:", err);
        return c.json({ error: "Wystąpił błąd serwera" }, 500);
    }
});

// app.route('/stooqapi', stooqApiController);

// zfeczuj se tym
//const res = await fetch("http://localhost:8000/stooqapi/quotes");
// const data = await res.json();
// oby to działał