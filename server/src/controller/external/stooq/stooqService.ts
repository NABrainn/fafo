export interface StockQuote {
    name: string;
    ticker: string;
    date: string;
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    change: number;
    changePositive: boolean;
}


export let quotes: StockQuote[] = []

export async function start() {
    await assignStooqData();
    startStooqDataSync();
}

export async function assignStooqData() {
    try {
        quotes = await fetchStooqData();
    } catch (err) {
        console.error("💥 Błąd podczas pobierania danych:", err);
    }
}

export function startStooqDataSync() {
    setInterval(async () => await assignStooqData(), 1000 * 60 * 60)
}

async function fetchStooqData(): Promise<StockQuote[]> {
    const companies = [
        { name: "Grupa Azoty", ticker: "ATT" },
        { name: "Ciech", ticker: "CIE" },
        { name: "Kernel", ticker: "KER" },
        { name: "Agroliga", ticker: "AGR" },
        { name: "Wielton", ticker: "WLT" },
        { name: "Gobarto", ticker: "GOB" },
    ];
    const results: StockQuote[] = [];

    for (const company of companies) {
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
        const change = evalChange(symbolData.close, symbolData.open, 4);
        const close = Number(parseFloat(symbolData.close).toFixed(2));

        results.push({
            name: company.name,
            ticker: company.ticker,
            date: symbolData.date,
            time: symbolData.time,
            open: symbolData.open,
            high: symbolData.high,
            low: symbolData.low,
            close: close,
            volume: symbolData.volume,
            change: change,
            changePositive: change > 0
        });
    }
    return results;
}

function evalChange(close: number, open: number, precision: number): number {
    return parseFloat((((close - open) / open) * 2).toFixed(precision))
}

// tylko do testów
export function __setQuotesForTesting(mockQuotes: StockQuote[]) {
    quotes.length = 0;
    quotes.push(...mockQuotes);
}
