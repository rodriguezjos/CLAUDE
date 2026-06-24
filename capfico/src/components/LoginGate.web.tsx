import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// btoa('antoniafont') — works on HTTP and HTTPS
const PASS_B64 = 'YW50b25pYWZvbnQ=';
const STORAGE_KEY = 'capfico_auth_v1';

function checkPassword(input: string): boolean {
  try { return btoa(input.trim()) === PASS_B64; } catch { return false; }
}

export function LoginGate({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    setAuthenticated(stored === '1');
  }, []);

  useEffect(() => {
    if (authenticated === false) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [authenticated]);

  if (authenticated === null) return null;
  if (authenticated) return <>{children}</>;

  function handleLogin() {
    if (!password.trim()) return;
    if (checkPassword(password)) {
      localStorage.setItem(STORAGE_KEY, '1');
      setAuthenticated(true);
    } else {
      setError(true);
      setPassword('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  return (
    <View style={s.overlay}>
      <View style={s.card}>
        <View style={s.logoWrap}>
          <View style={s.logoCircle}>
            <Text style={s.logoText}>C</Text>
          </View>
        </View>

        <Text style={s.titol}>Capfico</Text>
        <Text style={s.subtitol}>Entra la contrasenya per accedir</Text>

        <TextInput
          ref={inputRef}
          style={[s.input, error && s.inputError]}
          secureTextEntry
          placeholder="Contrasenya"
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={t => { setPassword(t); setError(false); }}
          onSubmitEditing={handleLogin}
          returnKeyType="go"
          autoCapitalize="none"
          autoCorrect={false}
        />

        {error && (
          <Text style={s.errorText}>Contrasenya incorrecta</Text>
        )}

        <TouchableOpacity
          style={[s.btn, !password.trim() && s.btnDisabled]}
          onPress={handleLogin}
          activeOpacity={0.85}
        >
          <Text style={s.btnText}>Accedir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#F0F4F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: 340,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },
  logoWrap: { marginBottom: 20 },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#208AEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { fontSize: 28, fontWeight: '800', color: '#fff' },
  titol: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1A2E',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subtitol: {
    fontSize: 14,
    color: '#888',
    marginBottom: 28,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1A1A2E',
    backgroundColor: '#FAFAFA',
    marginBottom: 12,
    outlineStyle: 'none',
  } as any,
  inputError: {
    borderColor: '#E74C3C',
    backgroundColor: '#FFF5F5',
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 13,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  btn: {
    width: '100%',
    height: 48,
    backgroundColor: '#208AEF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  btnDisabled: { backgroundColor: '#B0CFEF' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
