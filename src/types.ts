export type MilkType =
  | 'Cow'
  | 'Goat'
  | 'Sheep'
  | 'Buffalo'
  | 'Mixed'
  | string;

export type Texture =
  | 'Fresh'
  | 'Soft'
  | 'Semi-soft'
  | 'Semi-hard'
  | 'Hard'
  | 'Blue'
  | 'Brined'
  | 'Firm'
  | string;

export type Pairings = {
  wine: string[];
  beer: string[];
  fruit: string[];
  bread: string[];
};

export type Cheese = {
  id: string;
  name: string;
  country: string;
  region?: string;
  milkType: MilkType;
  texture: Texture;
  agingTime: string;
  flavorNotes: string[];
  aroma: string;
  rindType: string;
  pasteType: string;
  fatPercent: number | null;
  pdoPgiStatus: string | null;
  pairings: Pairings;
  allergens: string[];
  vegetarianSuitability: 'Vegetarian' | 'Not vegetarian' | 'Depends' | string;
  storage: string;
  servingSuggestions: string;
};
