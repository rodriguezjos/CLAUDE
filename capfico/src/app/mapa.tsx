import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker, Region } from 'react-native-maps';

import { TOTES_LES_CALAS } from '../data/calas';
import { Cala } from '../data/types';
import { zonaById } from '../data/zones';
import { useProgresContext } from '../store/ProgresContext';
import { distanciaMetres } from '../utils/geofence';

const MALLORCA: Region = {
  latitude: 39.63,
  longitude: 2.97,
  latitudeDelta: 0.85,
  longitudeDelta: 1.0,
};

export default function MapaScreen() {
  const { visitadesIds, marcarVisitada } = useProgresContext();
  const mapRef = useRef<MapView>(null);
  const [ubicacio, setUbicacio] = useState<Location.LocationObject | null>(null);
  const [permisRefusat, setPermisRefusat] = useState(false);
  const [calaProxima, setCalaProxima] = useState<Cala | null>(null);
  const [checkinNom, setCheckinNom] = useState<string | null>(null);

  // Demanar permisos i seguir ubicació
  useEffect(() => {
    let sub: Location.LocationSubscription | null = null;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setPermisRefusat(true);
        return;
      }
      sub = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 5 },
        (loc) => setUbicacio(loc),
      );
    })();

    return () => { sub?.remove(); };
  }, []);

  // Detectar si l'usuari és dins el radi d'una cala no visitada
  useEffect(() => {
    if (!ubicacio) return;
    const { latitude, longitude } = ubicacio.coords;
    const propera = TOTES_LES_CALAS.find(
      (c) =>
        !visitadesIds.has(c.id) &&
        distanciaMetres(latitude, longitude, c.lat, c.lng) <= c.radiGeofence,
    ) ?? null;
    setCalaProxima(propera);
  }, [ubicacio, visitadesIds]);

  async function ferCheckin() {
    if (!calaProxima) return;
    await marcarVisitada(calaProxima.id);
    setCheckinNom(calaProxima.nom);
    setCalaProxima(null);
    setTimeout(() => setCheckinNom(null), 3000);
  }

  return (
    <View style={s.container}>
      <MapView
        ref={mapRef}
        style={s.mapa}
        initialRegion={MALLORCA}
        showsUserLocation
        showsMyLocationButton
      >
        {TOTES_LES_CALAS.map((cala) => {
          const visitada = visitadesIds.has(cala.id);
          const color = visitada ? '#27AE60' : (zonaById[cala.zona]?.color ?? '#1E8AFF');
          return (
            <Marker
              key={cala.id}
              coordinate={{ latitude: cala.lat, longitude: cala.lng }}
              title={cala.nom}
              description={cala.dificultat}
              pinColor={color}
            />
          );
        })}
      </MapView>

      {/* Banner: cala propera no visitada */}
      {calaProxima && (
        <View style={s.banner}>
          <View style={s.bannerInfo}>
            <Text style={s.bannerTitol}>📍 Ets a {calaProxima.nom}!</Text>
            <Text style={s.bannerSub}>Prem per marcar-la com a visitada</Text>
          </View>
          <TouchableOpacity style={s.checkinBtn} onPress={ferCheckin}>
            <Text style={s.checkinBtnText}>Capfico ✓</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Confirmació de check-in */}
      {checkinNom && (
        <View style={s.confirmacio}>
          <Text style={s.confirmacioText}>✅ {checkinNom} visitada!</Text>
        </View>
      )}

      {/* Avís si no hi ha permisos */}
      {permisRefusat && (
        <View style={s.avis}>
          <Text style={s.avisText}>
            Cal permís d'ubicació per al check-in per GPS. Activa'l a Configuració.
          </Text>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  mapa: { flex: 1 },

  banner: {
    position: 'absolute',
    bottom: 32,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  bannerInfo: { flex: 1 },
  bannerTitol: { fontSize: 15, fontWeight: '700', color: '#1A1A2E' },
  bannerSub: { fontSize: 12, color: '#888', marginTop: 2 },
  checkinBtn: {
    backgroundColor: '#1E8AFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  checkinBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  confirmacio: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    backgroundColor: '#27AE60',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  confirmacioText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  avis: {
    position: 'absolute',
    bottom: 32,
    left: 16,
    right: 16,
    backgroundColor: '#FFF3CD',
    borderRadius: 12,
    padding: 14,
  },
  avisText: { color: '#856404', fontSize: 13, textAlign: 'center' },
});
