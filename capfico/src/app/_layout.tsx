import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { LoginGate } from '@/components/LoginGate';
import { ProgresProvider } from '@/store/ProgresContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <LoginGate>
        <ProgresProvider>
          <AnimatedSplashOverlay />
          <AppTabs />
        </ProgresProvider>
      </LoginGate>
    </ThemeProvider>
  );
}
