import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/signup" options={{ headerShown: false }} />
        <Stack.Screen name="(main)/home" options={{ headerShown: false }} />
        <Stack.Screen name="(main)/cardlist" options={{ headerShown: false }} />
        <Stack.Screen name="(main)/cardregister" options={{ headerShown: false }} />
        <Stack.Screen name="(main)/benefitlist" options={{ headerShown: false }} />
        <Stack.Screen name="(main)/adminpage" options={{ headerShown: false }} />
        <Stack.Screen name="(main)/benefitregister" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}