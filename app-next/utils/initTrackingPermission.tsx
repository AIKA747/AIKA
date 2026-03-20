import { getTrackingStatus, requestTrackingPermission } from 'react-native-tracking-transparency';

export default async function initTrackingPermission() {
  const trackingStatus = await getTrackingStatus();
  if (trackingStatus === 'not-determined') {
    await requestTrackingPermission();
    await initTrackingPermission();
    return false;
  }
  if (trackingStatus === 'authorized' || trackingStatus === 'unavailable') {
    return true;
  }
}
