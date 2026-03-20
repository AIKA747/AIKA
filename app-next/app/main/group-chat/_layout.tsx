import { Stack } from 'expo-router';

export default function GroupChatLayout() {
  return (
    <Stack>
      <Stack.Screen name="create" options={{ headerShown: false, animation: 'slide_from_bottom' }} />
      <Stack.Screen name="join" options={{ headerShown: false }} />
      <Stack.Screen
        name="chat/[roomId]"
        options={{ headerShown: false }}
        dangerouslySingular={(name, params) => `group-chat-${name}-${params?.roomId}`}
      />
      <Stack.Screen
        name="about/[roomId]/featured"
        options={{ headerShown: false }}
        dangerouslySingular={(name, params) => `group-chat-${name}-${params?.roomId}`}
      />
      <Stack.Screen
        name="about/[roomId]/history"
        options={{ headerShown: false }}
        dangerouslySingular={(name, params) => `group-chat-${name}-${params?.roomId}`}
      />
      <Stack.Screen
        name="about/[roomId]/index"
        options={{ headerShown: false }}
        dangerouslySingular={(name, params) => `group-chat-${name}-${params?.roomId}`}
      />
      <Stack.Screen
        name="about/[roomId]/media"
        options={{ headerShown: false }}
        dangerouslySingular={(name, params) => `group-chat-${name}-${params?.roomId}`}
      />
      <Stack.Screen
        name="about/[roomId]/members"
        options={{ headerShown: false }}
        dangerouslySingular={(name, params) => `group-chat-${name}-${params?.roomId}`}
      />
      <Stack.Screen
        name="about/[roomId]/moderators"
        options={{ headerShown: false }}
        dangerouslySingular={(name, params) => `group-chat-${name}-${params?.roomId}`}
      />
      <Stack.Screen
        name="about/[roomId]/modify"
        options={{ headerShown: false }}
        dangerouslySingular={(name, params) => `group-chat-${name}-${params?.roomId}`}
      />
      <Stack.Screen
        name="about/[roomId]/notifications"
        options={{ headerShown: false }}
        dangerouslySingular={(name, params) => `group-chat-${name}-${params?.roomId}`}
      />
      <Stack.Screen
        name="about/[roomId]/permissions"
        options={{ headerShown: false }}
        dangerouslySingular={(name, params) => `group-chat-${name}-${params?.roomId}`}
      />
      <Stack.Screen
        name="about/[roomId]/robot"
        options={{ headerShown: false }}
        dangerouslySingular={(name, params) => `group-chat-${name}-${params?.roomId}`}
      />
      <Stack.Screen
        name="about/[roomId]/theme"
        options={{ headerShown: false }}
        dangerouslySingular={(name, params) => `group-chat-${name}-${params?.roomId}`}
      />
      <Stack.Screen
        name="about/[roomId]/type"
        options={{ headerShown: false }}
        dangerouslySingular={(name, params) => `group-chat-${name}-${params?.roomId}`}
      />
    </Stack>
  );
}
