import { useIntl } from 'react-intl';
import { ScrollView, Text, View } from 'react-native';
import { StyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import { TextStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Button from '@/components/Button';
import NavBar from '@/components/NavBar';
import PageView from '@/components/PageView';
import Toast from '@/components/Toast';
import { useAuth } from '@/hooks/useAuth';
import { useConfigProvider } from '@/hooks/useConfig';
import { deleteUserAppOpenApiDelete } from '@/services/userService';
import pxToDp from '@/utils/pxToDp';

import styles from './styles';

export default function DeleteAccount() {
  const { computedThemeColor } = useConfigProvider();
  const intl = useIntl();
  const insets = useSafeAreaInsets();
  const { signOut } = useAuth();
  const renderItem = ({ text, style }: { text: string; style?: StyleProp<TextStyle> | undefined }) => {
    if (text.startsWith('> ')) {
      return (
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: pxToDp(12) }}>
          <View
            style={{
              width: pxToDp(10),
              marginTop: pxToDp(12),
              marginLeft: pxToDp(12),
              aspectRatio: 1,
              backgroundColor: computedThemeColor.text_secondary,
              borderRadius: pxToDp(12),
            }}
          />
          <View style={{ flex: 1 }}>
            <Text style={style}>{text.replace('> ', '')}</Text>
          </View>
        </View>
      );
    }
    return <Text style={style}>{text}</Text>;
  };
  return (
    <PageView style={styles.page}>
      <NavBar title={intl.formatMessage({ id: 'Setting.deleteAccount' })} />
      <View style={[styles.container, { paddingBottom: insets.bottom + pxToDp(24) }]}>
        <ScrollView style={[styles.content]}>
          {[
            renderItem({
              text: intl.formatMessage({ id: 'deactivate.paragraph.title' }),
              style: styles.contentTextTitle,
            }),
            renderItem({
              text: intl.formatMessage({ id: 'deactivate.paragraph.text.1' }),
              style: styles.contentTextP,
            }),
            renderItem({
              text: intl.formatMessage({ id: 'deactivate.paragraph.text.2' }),
              style: styles.contentTextP,
            }),
            renderItem({
              text: intl.formatMessage({ id: 'deactivate.paragraph.text.3' }),
              style: styles.contentTextP,
            }),
            renderItem({
              text: intl.formatMessage({ id: 'deactivate.paragraph.text.4' }),
              style: styles.contentTextP,
            }),
            renderItem({
              text: intl.formatMessage({ id: 'deactivate.paragraph.text.5' }),
              style: styles.contentTextP,
            }),
            renderItem({
              text: intl.formatMessage({ id: 'deactivate.paragraph.text.6' }),
              style: styles.contentTextP,
            }),
          ].map((item, index) => {
            return (
              <View key={index} style={styles.contentTextRow}>
                {item}
              </View>
            );
          })}
        </ScrollView>
        <Button
          type="primary"
          textStyle={{ color: computedThemeColor.primary }}
          onPress={async () => {
            const resp = await deleteUserAppOpenApiDelete();
            if (resp.data.code !== 0) {
              Toast.error(resp.data.msg);
            } else {
              Toast.success(intl.formatMessage({ id: 'Setting.deleteAccount.success' }));
              await signOut();
            }
          }}>
          {intl.formatMessage({ id: 'Confirm' })}
        </Button>
      </View>
    </PageView>
  );
}
