import { Stack } from 'expo-router';

import StoryProvider from '@/hooks/useStory';

export default function StoryLayout() {
  return (
    <StoryProvider>
      <Stack>
        <Stack.Screen
          name="summary/[storyId]"
          options={{ headerShown: false }}
          dangerouslySingular={(name, params) => `story-${name}-${params?.storyId}`}
        />
        <Stack.Screen
          name="details/[storyId]"
          options={{ headerShown: false }}
          dangerouslySingular={(name, params) => `story-${name}-${params?.storyId}`}
        />
        <Stack.Screen
          name="chat/[storyId]"
          options={{ headerShown: false }}
          dangerouslySingular={(name, params) => `story-${name}-${params?.storyId}`}
        />
      </Stack>
    </StoryProvider>
  );
}
