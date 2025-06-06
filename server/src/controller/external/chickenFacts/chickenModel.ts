export interface Fact {
    id: number;
    fact: string;
    source: string;
    published: string;
}

export interface CountResponse {
    count: number;
    last_counted: string;
}

const BASE_URL = 'https://chickenfacts.io/api/v1';

export async function getFactById(id: number): Promise<Fact> {
    const res = await fetch(`${BASE_URL}/facts/${id}.json`);
    if (!res.ok) throw new Error(`Nie znaleziono faktu o ID ${id}`);
    return res.json();
}

export async function getFactCount(): Promise<CountResponse> {
    const res = await fetch(`${BASE_URL}/facts.json`);
    if (!res.ok) throw new Error('Błąd przy pobieraniu liczby faktów');
    return res.json();
}
