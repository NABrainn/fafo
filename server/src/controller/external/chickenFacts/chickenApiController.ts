import { Hono } from 'hono';
import { getFactById, getFactCount } from './chickenApiModel.ts';
import type { Fact } from './chickenApiModel.ts';

export type Result = {
    fact?: Fact;
    count?: number;
    last_counted?: string;
}

export const chickenApiController = new Hono();

chickenApiController.get('/public/facts', async (c) => {
    const factId = Math.floor(Math.random() * 31);

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

