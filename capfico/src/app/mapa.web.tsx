import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TOTES_LES_CALAS } from '../data/calas';
import { ZONES, zonaById } from '../data/zones';
import { ZonaId } from '../data/types';
import { useProgresContext } from '../store/ProgresContext';

declare global { interface Window { L: any } }

const DIF_COLOR: Record<string, string> = {
  'fàcil': '#27AE60',
  'moderada': '#E67E22',
  'difícil': '#E74C3C',
};

export default function MapaScreen() {
  const { visitadesIds, marcarVisitada, desmarcarVisitada } = useProgresContext();
  const [checkinNom, setCheckinNom] = useState<string | null>(null);
  const [activeZones, setActiveZones] = useState<Set<ZonaId>>(new Set(ZONES.map(z => z.id)));
  const [filtreObert, setFiltreObert] = useState(false);
  const [leafletReady, setLeafletReady] = useState(false);

  const mapContainerRef = useRef<any>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());

  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
      document.head.appendChild(link);
    }
    if (window.L) { setLeafletReady(true); return; }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
    script.onload = () => setLeafletReady(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!leafletReady || !mapContainerRef.current || mapRef.current) return;
    const L = window.L;
    const MALLORCA_BOUNDS = [[39.18, 2.25], [40.05, 3.50]] as [[number,number],[number,number]];

    mapRef.current = L.map(mapContainerRef.current, {
      maxBounds: MALLORCA_BOUNDS,
      maxBoundsViscosity: 1.0,
      minZoom: 9,
      maxZoom: 17,
    }).setView([39.58, 2.87], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OSM',
      maxZoom: 17,
      bounds: MALLORCA_BOUNDS,
    }).addTo(mapRef.current);
  }, [leafletReady]);

  useEffect(() => {
    if (!mapRef.current || !leafletReady) return;
    const L = window.L;
    const map = mapRef.current;

    markersRef.current.forEach(m => m.remove());
    markersRef.current.clear();

    TOTES_LES_CALAS.filter(c => activeZones.has(c.zona)).forEach(cala => {
      const zona = zonaById[cala.zona];
      const visitada = visitadesIds.has(cala.id);

      const marker = L.circleMarker([cala.lat, cala.lng], {
        radius: visitada ? 9 : 7,
        fillColor: zona.color,
        color: '#fff',
        weight: visitada ? 2.5 : 1.5,
        fillOpacity: visitada ? 1 : 0.75,
      }).addTo(map);

      const el = document.createElement('div');
      el.style.cssText = 'font-family:system-ui,sans-serif;min-width:155px';
      el.innerHTML = `
        <div style="font-weight:600;font-size:14px;margin-bottom:3px;color:#111">${cala.nom}</div>
        <div style="color:${zona.color};font-size:12px;margin-bottom:2px;font-weight:500">${zona.nom}</div>
        <div style="color:${DIF_COLOR[cala.dificultat]};font-size:12px;margin-bottom:10px">${cala.dificultat}</div>
      `;
      const btn = document.createElement('button');
      btn.textContent = visitada ? 'Desfer visita' : '✓ Marcar visitada';
      btn.style.cssText = `
        width:100%;padding:6px 0;
        background:${visitada ? '#f5f5f5' : '#208AEF'};
        color:${visitada ? '#888' : '#fff'};
        border:${visitada ? '1px solid #ddd' : 'none'};
        border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;
      `;
      btn.onclick = async () => {
        map.closePopup();
        if (visitada) {
          await desmarcarVisitada(cala.id);
        } else {
          await marcarVisitada(cala.id);
          setCheckinNom(cala.nom);
          setTimeout(() => setCheckinNom(null), 2500);
        }
      };
      el.appendChild(btn);
      marker.bindPopup(el);
      markersRef.current.set(cala.id, marker);
    });
  }, [leafletReady, activeZones, visitadesIds, marcarVisitada, desmarcarVisitada]);

  function toggleZona(zonaId: ZonaId) {
    setActiveZones(prev => {
      const next = new Set(prev);
      if (next.has(zonaId)) next.delete(zonaId);
      else next.add(zonaId);
      return next;
    });
  }

  function toggleTotes() {
    setActiveZones(prev =>
      prev.size === ZONES.length
        ? new Set()
        : new Set(ZONES.map(z => z.id))
    );
  }

  const totesActives = activeZones.size === ZONES.length;
  const calesVisibles = TOTES_LES_CALAS.filter(c => activeZones.has(c.zona)).length;

  return (
    <SafeAreaView style={s.root}>
      <View ref={mapContainerRef} style={s.mapa} />

      {/* Panel de filtres (desplegable) */}
      {filtreObert && (
        <View style={s.panel}>
          <View style={s.panelCapcalera}>
            <Text style={s.panelTitol}>Zones</Text>
            <TouchableOpacity onPress={toggleTotes} style={s.btnTotes}>
              <Text style={s.btnTotesText}>{totesActives ? 'Cap' : 'Totes'}</Text>
            </TouchableOpacity>
          </View>
          {ZONES.map(zona => {
            const activa = activeZones.has(zona.id);
            return (
              <TouchableOpacity
                key={zona.id}
                onPress={() => toggleZona(zona.id)}
                style={s.zonaFila}
                activeOpacity={0.7}
              >
                <View style={[s.zonaDot, { backgroundColor: zona.color, opacity: activa ? 1 : 0.25 }]} />
                <Text style={[s.zonaNom, !activa && s.zonaNomInactiva]}>{zona.nom}</Text>
                <View style={[s.toggle, activa && s.toggleActiu]}>
                  {activa && <View style={s.toggleThumb} />}
                </View>
              </TouchableOpacity>
            );
          })}
          <View style={s.panelPeu}>
            <Text style={s.panelPeuText}>{calesVisibles} calas visibles</Text>
          </View>
        </View>
      )}

      {/* Botó flotant de filtre */}
      <TouchableOpacity
        style={[s.botoFiltre, filtreObert && s.botoFiltreActiu]}
        onPress={() => setFiltreObert(o => !o)}
        activeOpacity={0.85}
      >
        <Text style={s.botoFiltreIcon}>{filtreObert ? '✕' : '⊞'}</Text>
        <Text style={[s.botoFiltreText, filtreObert && s.botoFiltreTextActiu]}>
          {filtreObert ? 'Tancar' : 'Zones'}
        </Text>
      </TouchableOpacity>

      {/* Banner de check-in */}
      {checkinNom && (
        <View style={s.banner}>
          <Text style={s.bannerText}>✓ {checkinNom} visitada!</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  mapa: { flex: 1 },

  panel: {
    position: 'absolute',
    bottom: 72,
    right: 16,
    width: 220,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 2000,
    overflow: 'hidden',
  },
  panelCapcalera: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  panelTitol: { fontSize: 14, fontWeight: '700', color: '#111' },
  btnTotes: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  btnTotesText: { fontSize: 12, color: '#555', fontWeight: '600' },
  zonaFila: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
  },
  zonaDot: { width: 12, height: 12, borderRadius: 6 },
  zonaNom: { flex: 1, fontSize: 13, color: '#111', fontWeight: '500' },
  zonaNomInactiva: { color: '#bbb' },
  toggle: {
    width: 36,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActiu: { backgroundColor: '#208AEF' },
  toggleThumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    alignSelf: 'flex-end',
  },
  panelPeu: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#eee',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  panelPeuText: { fontSize: 11, color: '#999', textAlign: 'center' },

  botoFiltre: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 2000,
  },
  botoFiltreActiu: { backgroundColor: '#1A1A2E' },
  botoFiltreIcon: { fontSize: 16, color: '#208AEF' },
  botoFiltreText: { fontSize: 13, fontWeight: '700', color: '#1A1A2E' },
  botoFiltreTextActiu: { color: '#fff' },

  banner: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    backgroundColor: '#27AE60',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    zIndex: 1500,
  },
  bannerText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
