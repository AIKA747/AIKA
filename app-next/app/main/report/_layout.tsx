import { Stack } from 'expo-router';

export default function ReportLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="create" options={{ headerShown: false }} />
      <Stack.Screen
        name="details/[reportId]"
        options={{ headerShown: false }}
        dangerouslySingular={(name, params) => `report-detail-${name}-${params?.reportId}`}
      />
    </Stack>
  );
}
