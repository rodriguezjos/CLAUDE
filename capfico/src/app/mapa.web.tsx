import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TOTES_LES_CALAS } from '../data/calas';
import { ZONES, zonaById } from '../data/zones';
import { Cala } from '../data/types';
import { useProgresContext } from '../store/ProgresContext';

// Fallback web: llista interactiva amb simulació de check-in (el mapa natiu funciona al mòbil)
export default function MapaScreen() {
  const { visitadesIds, marcarVisitada, desmarcarVisitada } = useProgresContext();
  const [checkinNom, setCheckinNom] = useState<string | null>(null);

  async function simularCheckin(cala: Cala) {
    await marcarVisitada(cala.id);
    setCheckinNom(cala.nom);
    setTimeout(() => setCheckinNom(null), 2500);
  }

  return (
    <SafeAreaView style={s.container}>
      <ScrollView contentContainerStyle={s.scroll}>
        <Text style={s.titol}>Mapa</Text>
        <View style={s.avisWeb}>
          <Text style={s.avisIcon}>📱</Text>
          <Text style={s.avisText}>
            El mapa interactiu amb check-in per GPS és disponible a l'app mòbil.
            Aquí pots simular visites per provar la col·lecció.
          </Text>
        </View>

        {checkinNom && (
          <View style={s.confirmacio}>
            <Text style={s.confirmacioText}>✅ {checkinNom} visitada!</Text>
          </View>
        )}

        {ZONES.filter(z => TOTES_LES_CALAS.some(c => c.zona === z.id)).map(zona => {
          const calesZona = TOTES_LES_CALAS.filter(c => c.zona === zona.id);
          return (
            <View key={zona.id} style={s.zonaBloc}>
              <View style={s.zonaCapcalera}>
                <View style={[s.zonaColor, { backgroundColor: zona.color }]} />
                <Text style={s.zonaNom}>{zona.nom}</Text>
              </View>
              {calesZona.map(cala => {
                const visitada = visitadesIds.has(cala.id);
                return (
                  <View key={cala.id} style={[s.calaFila, visitada && s.calaVisitada]}>
                    <View style={s.calaEsquerra}>
                      <Text style={s.calaIcon}>{visitada ? '✓' : '○'}</Text>
                      <View>
                        <Text style={[s.calaNom, visitada && s.calaNomVerd]}>
                          {cala.nom}
                        </Text>
                        <Text style={s.calaDif}>{cala.dificultat}</Text>
                      </View>
                    </View>
                    {visitada ? (
                      <TouchableOpacity
                        style={s.btnDesmarcar}
                        onPress={() => desmarcarVisitada(cala.id)}
                      >
                        <Text style={s.btnDesmarcarText}>Desfer</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={s.btnCheckin}
                        onPress={() => simularCheckin(cala)}
                      >
                        <Text style={s.btnCheckinText}>Simula visita</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  scroll: { padding: 16, paddingBottom: 32 },
  titol: { fontSize: 28, fontWeight: '800', color: '#1A1A2E', marginBottom: 16 },

  avisWeb: {
    backgroundColor: '#EBF4FF',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 16,
  },
  avisIcon: { fontSize: 20 },
  avisText: { flex: 1, fontSize: 13, color: '#1E5FA6', lineHeight: 18 },

  confirmacio: {
    backgroundColor: '#27AE60',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  confirmacioText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  zonaBloc: { marginBottom: 20 },
  zonaCapcalera: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  zonaColor: { width: 12, height: 12, borderRadius: 6 },
  zonaNom: { fontSize: 17, fontWeight: '700', color: '#1A1A2E' },

  calaFila: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 6,
  },
  calaVisitada: { backgroundColor: '#F0FAF4' },
  calaEsquerra: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  calaIcon: { fontSize: 16, color: '#27AE60', width: 20, textAlign: 'center' },
  calaNom: { fontSize: 14, fontWeight: '500', color: '#333' },
  calaNomVerd: { color: '#27AE60' },
  calaDif: { fontSize: 11, color: '#aaa', marginTop: 2 },

  btnCheckin: {
    backgroundColor: '#1E8AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  btnCheckinText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  btnDesmarcar: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  btnDesmarcarText: { color: '#888', fontSize: 12 },
});
