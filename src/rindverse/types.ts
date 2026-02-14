export type RegionKey = 'spain' | 'france';

export type BiomeKey =
  | 'spain-mediterranean'
  | 'spain-pyrenees'
  | 'france-normandy'
  | 'france-alps';

export type RindverseStep = 'portal' | 'globe' | 'biome' | 'cheese' | 'ritual';

export type FeaturedCheese = {
  id: string; // matches cheeses.json id (slug)
  label: string;
  tagline: string;
  flavorNotes: string[];
};

export type Biome = {
  key: BiomeKey;
  name: string;
  description: string;
  featured: FeaturedCheese[];
};

export type Region = {
  key: RegionKey;
  name: string;
  description: string;
  biomes: Biome[];
};
