import { Hono } from 'hono';
// @ts-ignore
import { getFactById, getFactCount } from './chickenModel.ts';
import type { Fact } from './chickenModel.ts';

export type Result = {
    fact?: Fact;
    count?: number;
    last_counted?: string;
}

export const chickenController = new Hono();

chickenController.get('/public/facts', async (c) => {
    const factId = Math.floor(Math.random() * 31) + 1;

    try {
        const results: Result = {};

        const [countData, factData] = await Promise.all([
            getFactCount().catch((err) => {
                console.warn('Błąd podczas pobierania liczby faktów:', err);
                return null;
            }),
            getFactById(factId).catch((err) => {
                console.warn(`Błąd podczas pobierania faktu o ID ${factId}:`, err);
                return null;
            })
        ]);

        if (countData) {
            results.count = countData.count;
            results.last_counted = countData.last_counted;
        }

        if (factData) {
            results.fact = factData;
        }

        return c.json(results);
    } catch (err) {
        console.error('💥 Błąd serwera ChickenFacts:', err);
        return c.json({ error: 'Wystąpił błąd serwera' }, 500);
    }
});

