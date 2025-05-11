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
}