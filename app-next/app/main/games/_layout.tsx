import { Stack } from 'expo-router';

export default function GamesLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="details/[gameId]"
        options={{ headerShown: false }}
        dangerouslySingular={(name, params) => `games-${name}-${params?.gameId}`}
      />
      <Stack.Screen
        name="chat/[gameId]"
        options={{ headerShown: false }}
        dangerouslySingular={(name, params) => `games-${name}-${params?.gameId}`}
      />
      <Stack.Screen
        name="result/[gameId]"
        options={{ headerShown: false }}
        dangerouslySingular={(name, params) => `games-${name}-${params?.gameId}`}
      />
    </Stack>
  );
}
