import { Zona } from './types';

export const ZONES: Zona[] = [
  { id: 'migjorn',   nom: 'Migjorn',              color: '#F5A623' },
  { id: 'santanyi',  nom: 'Santanyí',              color: '#4A90D9' },
  { id: 'llevant',   nom: 'Llevant',               color: '#7ED321' },
  { id: 'tramuntana',nom: 'Tramuntana',             color: '#9B59B6' },
  { id: 'ponent',    nom: 'Ponent',                color: '#E74C3C' },
  { id: 'alcudia',   nom: "Badia d'Alcúdia",       color: '#1ABC9C' },
];

export const zonaById = Object.fromEntries(ZONES.map(z => [z.id, z])) as Record<string, Zona>;
