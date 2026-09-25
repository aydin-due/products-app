import { useTheme } from '@/presentation/theme/hooks/use-theme';
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const bgColor = useTheme().background

  const [loaded] = useFonts({
    KanitBold: require('../../assets/fonts/Kanit-Bold.ttf'),
    KanitRegular: require('../../assets/fonts/Kanit-Regular.ttf'),
    KanitThin: require('../../assets/fonts/Kanit-Thin.ttf'),
  })

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return (
    <GestureHandlerRootView style={{ backgroundColor: bgColor, flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          ></Stack>
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
