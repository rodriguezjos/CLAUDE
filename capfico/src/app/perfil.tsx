import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProgresContext } from '../store/ProgresContext';

export default function PerfilScreen() {
  const { progres, carregant } = useProgresContext();

  if (carregant) {
    return (
      <SafeAreaView style={s.container}>
        <Text style={s.carregant}>Carregant...</Text>
      </SafeAreaView>
    );
  }

  const insignies = [
    {
      id: 'primer-capfico',
      nom: 'Primer Capfico',
      desc: 'Visita la primera cala',
      guanyada: progres.visitades >= 1,
      emoji: '🤿',
    },
    {
      id: 'explorador',
      nom: 'Explorador',
      desc: 'Visita 10 calas',
      guanyada: progres.visitades >= 10,
      emoji: '🧭',
    },
    {
      id: 'mestre-migjorn',
      nom: 'Mestre de Migjorn',
      desc: 'Completa totes les calas de Migjorn',
      guanyada: progres.perZona.find(z => z.zona === 'migjorn')?.percentatge === 100,
      emoji: '🏖️',
    },
    {
      id: 'mestre-santanyi',
      nom: 'Mestre de Santanyí',
      desc: 'Completa totes les calas de Santanyí',
      guanyada: progres.perZona.find(z => z.zona === 'santanyi')?.percentatge === 100,
      emoji: '🪸',
    },
    {
      id: 'meitat',
      nom: "Mig Capficador",
      desc: "Arriba al 50% de l'illa",
      guanyada: progres.percentatge >= 50,
      emoji: '⭐',
    },
    {
      id: 'mestre-total',
      nom: 'Mestre Capficador',
      desc: "Completa totes les calas de l'illa",
      guanyada: progres.percentatge === 100,
      emoji: '🏆',
    },
  ];

  return (
    <SafeAreaView style={s.container}>
      <ScrollView contentContainerStyle={s.scroll}>
        <Text style={s.titol}>El meu perfil</Text>

        <View style={s.resum}>
          <View style={s.resumItem}>
            <Text style={s.resumNum}>{progres.visitades}</Text>
            <Text style={s.resumLabel}>Calas visitades</Text>
          </View>
          <View style={s.divisor} />
          <View style={s.resumItem}>
            <Text style={s.resumNum}>{progres.percentatge}%</Text>
            <Text style={s.resumLabel}>de l'illa</Text>
          </View>
          <View style={s.divisor} />
          <View style={s.resumItem}>
            <Text style={s.resumNum}>{insignies.filter(i => i.guanyada).length}</Text>
            <Text style={s.resumLabel}>Insígnies</Text>
          </View>
        </View>

        <Text style={s.seccioTitol}>Insígnies</Text>
        {insignies.map(ins => (
          <View key={ins.id} style={[s.insignia, !ins.guanyada && s.insigniaBlocada]}>
            <Text style={[s.insigniaEmoji, !ins.guanyada && s.insigniaBlocadaEmoji]}>
              {ins.guanyada ? ins.emoji : '🔒'}
            </Text>
            <View style={s.insigniaText}>
              <Text style={[s.insigniaNom, !ins.guanyada && s.insigniaTextBlocat]}>
                {ins.nom}
              </Text>
              <Text style={[s.insigniaDesc, !ins.guanyada && s.insigniaTextBlocat]}>
                {ins.desc}
              </Text>
            </View>
            {ins.guanyada && <Text style={s.guanyada}>✓</Text>}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  scroll: { padding: 16, paddingBottom: 32 },
  carregant: { flex: 1, textAlign: 'center', marginTop: 40, color: '#666' },

  titol: { fontSize: 28, fontWeight: '800', color: '#1A1A2E', marginBottom: 20 },

  resum: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  resumItem: { alignItems: 'center' },
  resumNum: { fontSize: 28, fontWeight: '800', color: '#1E8AFF' },
  resumLabel: { fontSize: 12, color: '#888', marginTop: 2 },
  divisor: { width: 1, height: 40, backgroundColor: '#E8EDF2' },

  seccioTitol: { fontSize: 18, fontWeight: '700', color: '#1A1A2E', marginBottom: 12 },

  insignia: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    gap: 12,
  },
  insigniaBlocada: { backgroundColor: '#F5F7FA' },
  insigniaEmoji: { fontSize: 28 },
  insigniaBlocadaEmoji: { opacity: 0.4 },
  insigniaText: { flex: 1 },
  insigniaNom: { fontSize: 15, fontWeight: '600', color: '#1A1A2E' },
  insigniaDesc: { fontSize: 12, color: '#888', marginTop: 2 },
  insigniaTextBlocat: { color: '#aaa' },
  guanyada: { fontSize: 18, color: '#27AE60' },
});
