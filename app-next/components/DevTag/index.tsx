import { Text, View } from 'react-native';
import { getBuildNumber, getVersion } from 'react-native-device-info';

import { ConfigType, configType } from '@/constants/Config';
import pxToDp from '@/utils/pxToDp';

function DevTag() {
  if (configType !== ConfigType.DEV) {
    return null;
  }
  return (
    <View
      style={[
        {
          position: 'absolute',
          right: -pxToDp(60),
          top: pxToDp(30),
          paddingLeft: pxToDp(130),
          paddingRight: pxToDp(50),
          backgroundColor: '#78403F',
          opacity: 0.5,
          transform: [{ rotate: '45deg' }],
          pointerEvents: 'none',
        },
      ]}>
      <Text
        style={{
          fontSize: pxToDp(32),
          color: '#FFF',
        }}>
        {getVersion()}({getBuildNumber()})
      </Text>
    </View>
  );
}

export default DevTag;
