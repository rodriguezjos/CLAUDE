export type ZonaId =
  | 'migjorn'
  | 'santanyi'
  | 'llevant'
  | 'tramuntana'
  | 'ponent'
  | 'alcudia';

export type Dificultat = 'fàcil' | 'moderada' | 'difícil';

export interface Cala {
  id: string;
  nom: string;
  zona: ZonaId;
  lat: number;
  lng: number;
  /** Radi en metres per al check-in per GPS */
  radiGeofence: number;
  dificultat: Dificultat;
  descripcio?: string;
}

export interface Zona {
  id: ZonaId;
  nom: string;
  /** Color hex per al mapa i les barres de progrés */
  color: string;
}
