import { Stack } from 'expo-router';

const MainLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="agora-details/[postId]"
        options={{ headerShown: false }}
        dangerouslySingular={(name, params) => `agora-details-${name}-${params?.postId}`}
      />
      <Stack.Screen name="agoraPostPublish" options={{ headerShown: false }} />
      <Stack.Screen name="agoraSearch" options={{ headerShown: false }} />
      <Stack.Screen name="blockedUsers" options={{ headerShown: false }} />
      <Stack.Screen name="botCreate" options={{ headerShown: false }} />
      <Stack.Screen name="botCreatePreview" options={{ headerShown: false }} />
      <Stack.Screen name="botCreateSuccess" options={{ headerShown: false }} />
      <Stack.Screen name="botDetail" options={{ headerShown: false }} />
      <Stack.Screen name="botReport" options={{ headerShown: false }} />
      <Stack.Screen name="changePassword" options={{ headerShown: false }} />
      <Stack.Screen name="chatSearch" options={{ headerShown: false }} />
      <Stack.Screen name="deleteAccount" options={{ headerShown: false }} />
      <Stack.Screen name="fairyTales" options={{ headerShown: false }} />
      <Stack.Screen name="friend" options={{ headerShown: false }} />
      <Stack.Screen name="groupsRequests" options={{ headerShown: false }} />
      <Stack.Screen name="interestFill" options={{ headerShown: false }} />
      <Stack.Screen name="notifications" options={{ headerShown: false }} />
      <Stack.Screen name="payments" options={{ headerShown: false }} />
      <Stack.Screen name="personalInfoFillEdit" options={{ headerShown: false }} />
      <Stack.Screen name="profileFill" options={{ headerShown: false }} />
      <Stack.Screen name="ratingList" options={{ headerShown: false }} />
      <Stack.Screen name="recommendedFollow" options={{ headerShown: false }} />
      <Stack.Screen name="report" options={{ headerShown: false }} />
      <Stack.Screen name="setting" options={{ headerShown: false }} />
      <Stack.Screen name="updateEmail" options={{ headerShown: false }} />
      <Stack.Screen name="updateGender" options={{ headerShown: false }} />
      <Stack.Screen
        name="user-profile/[userId]"
        options={{ headerShown: false }}
        dangerouslySingular={(name, params) => `user-profile-${name}-${params?.userId}`}
      />
      <Stack.Screen name="story" options={{ headerShown: false }} />
      <Stack.Screen name="games" options={{ headerShown: false }} />
      <Stack.Screen name="experts" options={{ headerShown: false }} />
      <Stack.Screen name="group-chat" options={{ headerShown: false }} />
    </Stack>
  );
};

export default MainLayout;
