import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="products/[id]" />
        <Stack.Screen name="products/new" />
        <Stack.Screen name="products/[id]/edit" />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
