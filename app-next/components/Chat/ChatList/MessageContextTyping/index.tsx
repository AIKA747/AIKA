import { useIntl } from 'react-intl';
import { Text, View } from 'react-native';

import { ChatUiMode } from '@/components/Chat/types';
import DotLoading from '@/components/DotLoading';
import pxToDp from '@/utils/pxToDp';

import { styleStyles } from './styles';
import { MessageContextTextProps } from './types';

export default function MessageContextTyping({ chatUiMode }: MessageContextTextProps) {
  const intl = useIntl();
  return (
    <View style={{ maxWidth: pxToDp(140) }}>
      {chatUiMode === ChatUiMode.TEXT && (
        <View style={[styleStyles.tips]}>
          <Text style={[styleStyles.tipsText]}>{intl.formatMessage({ id: 'Typing' })} ...</Text>
        </View>
      )}
      <View style={[styleStyles.container]}>
        <DotLoading style={[styleStyles.loading]} size={pxToDp(10)} color="#fff" />
      </View>
    </View>
  );
}
