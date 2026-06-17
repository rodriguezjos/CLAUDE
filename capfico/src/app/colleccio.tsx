import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProgres, ProgresStat } from '../store/progress';
import { TOTES_LES_CALAS } from '../data/calas';
import { Cala } from '../data/types';

export default function ColleccioScreen() {
  const { progres, visitadesIds, carregant } = useProgres();

  if (carregant) {
    return (
      <SafeAreaView style={s.container}>
        <Text style={s.carregant}>Carregant...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.container}>
      <ScrollView contentContainerStyle={s.scroll}>
        <Text style={s.titol}>Capfico</Text>
        <Text style={s.subtitol}>Col·lecció de calas</Text>

        {/* Progrés global */}
        <View style={s.globalCard}>
          <Text style={s.globalNum}>{progres.percentatge}%</Text>
          <Text style={s.globalLabel}>de l'illa explorada</Text>
          <Text style={s.globalSub}>
            {progres.visitades} de {progres.total} calas
          </Text>
          <View style={s.barreraFons}>
            <View
              style={[s.barreraOmplerta, { width: `${progres.percentatge}%`, backgroundColor: '#1E8AFF' }]}
            />
          </View>
        </View>

        {/* Progrés per zona */}
        <Text style={s.seccioTitol}>Per zones</Text>
        {progres.perZona.map(zona => (
          <ZonaCard key={zona.zona} zona={zona} />
        ))}

        {/* Llista de calas */}
        <Text style={s.seccioTitol}>Totes les calas</Text>
        {TOTES_LES_CALAS.map(cala => (
          <CalaFila
            key={cala.id}
            cala={cala}
            visitada={visitadesIds.has(cala.id)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function ZonaCard({ zona }: { zona: ProgresStat }) {
  return (
    <View style={s.zonaCard}>
      <View style={s.zonaCapcalera}>
        <View style={[s.zonaColor, { backgroundColor: zona.color }]} />
        <Text style={s.zonaNom}>{zona.nomZona}</Text>
        <Text style={s.zonaPct}>{zona.percentatge}%</Text>
      </View>
      <View style={s.barreraFons}>
        <View
          style={[s.barreraOmplerta, { width: `${zona.percentatge}%`, backgroundColor: zona.color }]}
        />
      </View>
      <Text style={s.zonaCompte}>
        {zona.visitades}/{zona.total} calas
      </Text>
    </View>
  );
}

function CalaFila({ cala, visitada }: { cala: Cala; visitada: boolean }) {
  const dificultatColor: Record<string, string> = {
    'fàcil': '#27AE60',
    'moderada': '#F39C12',
    'difícil': '#E74C3C',
  };

  return (
    <View style={[s.calaFila, visitada && s.calaVisitada]}>
      <View style={s.calaEsquerra}>
        <Text style={s.calaIcon}>{visitada ? '✓' : '○'}</Text>
        <View>
          <Text style={[s.calaNom, visitada && s.calaNomVisitada]}>{cala.nom}</Text>
          <Text style={[s.calaDif, { color: dificultatColor[cala.dificultat] }]}>
            {cala.dificultat}
          </Text>
        </View>
      </View>
      {visitada && <Text style={s.calaVisitadaLabel}>Visitada</Text>}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  scroll: { padding: 16, paddingBottom: 32 },
  carregant: { flex: 1, textAlign: 'center', marginTop: 40, color: '#666' },

  titol: { fontSize: 32, fontWeight: '800', color: '#1A1A2E', marginBottom: 2 },
  subtitol: { fontSize: 14, color: '#666', marginBottom: 20 },

  globalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
  },
  globalNum: { fontSize: 56, fontWeight: '900', color: '#1E8AFF', lineHeight: 60 },
  globalLabel: { fontSize: 16, color: '#444', marginBottom: 4 },
  globalSub: { fontSize: 13, color: '#999', marginBottom: 12 },

  barreraFons: {
    width: '100%',
    height: 8,
    backgroundColor: '#E8EDF2',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barreraOmplerta: { height: '100%', borderRadius: 4 },

  seccioTitol: { fontSize: 18, fontWeight: '700', color: '#1A1A2E', marginBottom: 12, marginTop: 8 },

  zonaCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  zonaCapcalera: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  zonaColor: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
  zonaNom: { flex: 1, fontSize: 15, fontWeight: '600', color: '#1A1A2E' },
  zonaPct: { fontSize: 15, fontWeight: '700', color: '#1A1A2E' },
  zonaCompte: { fontSize: 12, color: '#999', marginTop: 6 },

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
  calaIcon: { fontSize: 18, color: '#27AE60', width: 22, textAlign: 'center' },
  calaNom: { fontSize: 14, fontWeight: '500', color: '#333' },
  calaNomVisitada: { color: '#27AE60' },
  calaDif: { fontSize: 11, marginTop: 2 },
  calaVisitadaLabel: { fontSize: 12, color: '#27AE60', fontWeight: '600' },
});
