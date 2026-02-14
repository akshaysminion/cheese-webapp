import type { Region } from './types';

export const RINDVERSE_REGIONS: Region[] = [
  {
    key: 'spain',
    name: 'Spain',
    description: 'Sun-baked wind, herbs in the air, milk turned into quiet power.',
    biomes: [
      {
        key: 'spain-mediterranean',
        name: 'Mediterranean Scrub',
        description: 'Rosemary heat, limestone dust, coastal light.',
        featured: [
          {
            id: 'manchego',
            label: 'Manchego',
            tagline: 'Lanolin + toasted grain; a clean, dry crescendo.',
            flavorNotes: ['nutty', 'buttery', 'salty finish', 'caramelized']
          },
          {
            id: 'mahón',
            label: 'Mahón',
            tagline: 'Sea-salt edge and browned butter on a steady bassline.',
            flavorNotes: ['salty finish', 'toasted nuts', 'buttery', 'tangy']
          }
        ]
      },
      {
        key: 'spain-pyrenees',
        name: 'Pyrenees Ridge',
        description: 'High pasture, cold stone caves, mineral air.',
        featured: [
          {
            id: 'idiazabal',
            label: 'Idiazabal',
            tagline: 'Smoked sheep’s milk with an alpine hush.',
            flavorNotes: ['smoky', 'nutty', 'savory', 'herbal']
          },
          {
            id: 'tetilla',
            label: 'Tetilla',
            tagline: 'Soft sweetness under a misty, coastal treble.',
            flavorNotes: ['milky', 'buttery', 'sweet', 'gentle']
          }
        ]
      }
    ]
  },
  {
    key: 'france',
    name: 'France',
    description: 'Pasture geometry, cellar silence, bloom and bite.',
    biomes: [
      {
        key: 'france-normandy',
        name: 'Normandy Pasture',
        description: 'Cool grass, apple skin, cream and rain.',
        featured: [
          {
            id: 'camembert-de-normandie',
            label: 'Camembert de Normandie',
            tagline: 'Mushroom bloom and warm butter in slow rotation.',
            flavorNotes: ['creamy', 'mushroomy', 'earthy', 'buttery']
          },
          {
            id: 'pont-l’évêque',
            label: 'Pont-l’Évêque',
            tagline: 'Square, supple, and floral with a salted core.',
            flavorNotes: ['creamy', 'tangy', 'floral', 'salty finish']
          }
        ]
      },
      {
        key: 'france-alps',
        name: 'Alpine Cellars',
        description: 'Cave humidity, crystalline crunch, long echoes.',
        featured: [
          {
            id: 'comté',
            label: 'Comté',
            tagline: 'Hazelnut resonance; brothy depth; bright lift.',
            flavorNotes: ['nutty', 'brothy', 'umami', 'fruity']
          },
          {
            id: 'roquefort',
            label: 'Roquefort',
            tagline: 'Blue lightning in a velvet storm.',
            flavorNotes: ['salty finish', 'tangy', 'earthy', 'spicy']
          }
        ]
      }
    ]
  }
];
