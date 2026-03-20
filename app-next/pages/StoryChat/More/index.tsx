import { useIntl } from 'react-intl';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RestartOutline } from '@/components/Icon';
import { useConfigProvider } from '@/hooks/useConfig';
import pxToDp from '@/utils/pxToDp';

import styles from './styles';
import { MoreProps } from './types';

export default function StoryChatMore(props: MoreProps) {
  const { visible, onClose, onRestart, restarting = false } = props;

  const intl = useIntl();
  const insets = useSafeAreaInsets();
  const { computedThemeColor } = useConfigProvider();

  if (!visible) {
    return null;
  }

  return (
    <View
      style={[styles.containerWrapper]}
      onTouchEnd={() => {
        onClose?.();
      }}>
      <View
        style={[
          styles.container,
          {
            marginTop:
              insets.top +
              pxToDp(80) + // navbar 高度
              pxToDp(32),
            marginRight: pxToDp(32),
            backgroundColor: computedThemeColor.text,
          },
        ]}
        onTouchEnd={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}>
        {/* <View
          style={[
            styles.title,
            {
              borderColor: '#EBEBEB',
            },
          ]}
        >
          <Text
            style={[
              styles.titleText,
              {
                color: computedThemeColor.text,
              },
            ]}
          >
            {intl.formatMessage({ id: 'StoryChat.more.mainHero' })}
          </Text>
        </View> */}
        {/* <View
          style={[
            {
              borderWidth: pxToDp(2),
              borderColor: '#EBEBEB',
            },
          ]}
        /> */}

        {/* TODO 这个是什么功能 */}
        {/* <View style={[styles.tags]}>
          {tags.map((tag, index) => {
            const isActive = activeTagIndex === index;
            return (
              <TouchableOpacity
                key={tag.key}
                style={[
                  styles.tagsItem,
                  {
                    backgroundColor: isActive
                      ? computedThemeColor.primary
                      : computedThemeColor.primary + '30',
                    marginRight: index === tags.length - 1 ? pxToDp(0) : pxToDp(10),
                  },
                ]}
                onPress={() => {
                  setActiveTagIndex(index);
                }}
              >
                <Text
                  style={[
                    styles.tagsItemText,
                    {
                      color: isActive ? computedThemeColor.bg : computedThemeColor.text,
                    },
                  ]}
                >
                  {tag.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View> */}

        <TouchableOpacity
          style={[
            styles.title,
            {
              borderColor: 'transparent',
            },
          ]}
          onPress={onRestart}>
          <Text
            style={[
              styles.titleText,
              {
                color: computedThemeColor.text_black,
              },
            ]}>
            {intl.formatMessage({ id: 'Restart' })}
          </Text>
          <RestartOutline
            loading={restarting}
            style={[styles.titleIcon, { transform: '' }]}
            color={computedThemeColor.text_black}
            width={pxToDp(46)}
            height={pxToDp(46)}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
