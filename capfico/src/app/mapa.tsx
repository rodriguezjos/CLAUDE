import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// El mapa complet amb react-native-maps i geofencing GPS ve en la propera iteració.
export default function MapaScreen() {
  return (
    <SafeAreaView style={s.container}>
      <View style={s.centre}>
        <Text style={s.emoji}>🗺️</Text>
        <Text style={s.titol}>Mapa de les calas</Text>
        <Text style={s.sub}>Pròximament: mapa interactiu amb check-in per GPS</Text>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  centre: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emoji: { fontSize: 56, marginBottom: 16 },
  titol: { fontSize: 22, fontWeight: '700', color: '#1A1A2E', marginBottom: 8, textAlign: 'center' },
  sub: { fontSize: 15, color: '#888', textAlign: 'center', lineHeight: 22 },
});
