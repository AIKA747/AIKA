import { Stack } from 'expo-router';

export default function ExpertsLayout() {
  return (
    <Stack>
      <Stack.Screen name="category" options={{ headerShown: false }} />
      <Stack.Screen
        name="[categoryId]"
        options={{ headerShown: false }}
        dangerouslySingular={(name, params) => `expert-category-${name}-${params?.categoryId}`}
      />
      <Stack.Screen
        name="details/[expertId]"
        options={{ headerShown: false }}
        dangerouslySingular={(name, params) => `expert-details-${name}-${params?.gameId}`}
      />
      <Stack.Screen
        name="chat/[expertId]"
        options={{ headerShown: false }}
        dangerouslySingular={(name, params) => `expert-chat-${name}-${params?.gameId}`}
      />
    </Stack>
  );
}
