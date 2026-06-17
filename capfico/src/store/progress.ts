import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { TOTES_LES_CALAS } from '../data/calas';
import { ZONES } from '../data/zones';
import { ZonaId } from '../data/types';

const STORAGE_KEY = 'capfico_visitades';

async function loadVisitades(): Promise<Set<string>> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? new Set(JSON.parse(raw)) : new Set();
}

async function saveVisitades(ids: Set<string>): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
}

export interface ProgresStat {
  zona: ZonaId;
  nomZona: string;
  color: string;
  total: number;
  visitades: number;
  percentatge: number;
}

export interface ProgresGlobal {
  total: number;
  visitades: number;
  percentatge: number;
  perZona: ProgresStat[];
}

function calcularProgres(visitadesIds: Set<string>): ProgresGlobal {
  const perZona: ProgresStat[] = ZONES.map(z => {
    const calesZona = TOTES_LES_CALAS.filter(c => c.zona === z.id);
    const visitadesZona = calesZona.filter(c => visitadesIds.has(c.id)).length;
    return {
      zona: z.id,
      nomZona: z.nom,
      color: z.color,
      total: calesZona.length,
      visitades: visitadesZona,
      percentatge: calesZona.length > 0
        ? Math.round((visitadesZona / calesZona.length) * 100)
        : 0,
    };
  }).filter(z => z.total > 0);

  const total = TOTES_LES_CALAS.length;
  const visitades = TOTES_LES_CALAS.filter(c => visitadesIds.has(c.id)).length;

  return {
    total,
    visitades,
    percentatge: total > 0 ? Math.round((visitades / total) * 100) : 0,
    perZona,
  };
}

export function useProgres() {
  const [visitadesIds, setVisitadesIds] = useState<Set<string>>(new Set());
  const [carregant, setCarregant] = useState(true);

  useEffect(() => {
    loadVisitades().then(ids => {
      setVisitadesIds(ids);
      setCarregant(false);
    });
  }, []);

  async function marcarVisitada(calaId: string) {
    const next = new Set(visitadesIds);
    next.add(calaId);
    setVisitadesIds(next);
    await saveVisitades(next);
  }

  async function desmarcarVisitada(calaId: string) {
    const next = new Set(visitadesIds);
    next.delete(calaId);
    setVisitadesIds(next);
    await saveVisitades(next);
  }

  return {
    visitadesIds,
    carregant,
    marcarVisitada,
    desmarcarVisitada,
    progres: calcularProgres(visitadesIds),
  };
}
