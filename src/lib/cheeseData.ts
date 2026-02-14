import cheeses from '../data/cheeses.json';
import type { Cheese } from '../types';

export function getAllCheeses(): Cheese[] {
  return cheeses as unknown as Cheese[];
}

export function getCheeseById(id: string): Cheese | undefined {
  return getAllCheeses().find((c) => c.id === id);
}

export function getFilterOptions() {
  const all = getAllCheeses();
  const uniq = (vals: string[]) => Array.from(new Set(vals)).sort((a, b) => a.localeCompare(b));

  return {
    countries: uniq(all.map((c) => c.country)),
    milkTypes: uniq(all.map((c) => String(c.milkType))),
    textures: uniq(all.map((c) => String(c.texture)))
  };
}
