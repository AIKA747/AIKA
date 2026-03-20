import { router } from 'expo-router/build/imperative-api';
import React, { useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { View, Text, ViewStyle, StyleProp, TouchableOpacity } from 'react-native';

import Avatar from '@/components/Avatar';
import { PlayOutline } from '@/components/Icon';
import { useConfigProvider } from '@/hooks/useConfig';
import { getContentAppStory } from '@/services/gushichaxun';
import pxToDp from '@/utils/pxToDp';

import styles from '../../styles';

function StoryCard(props: {
  style?: StyleProp<ViewStyle>;
  storyDetail: Awaited<ReturnType<typeof getContentAppStory>>['data']['data']['list'][number];
}) {
  const { style, storyDetail } = props;
  const intl = useIntl();
  const { computedThemeColor } = useConfigProvider();

  const percent = useMemo(() => (storyDetail.storyProcess || 0) * 100, [storyDetail.storyProcess]);

  const routeToChat = useCallback(async () => {
    router.push({ pathname: '/main/story/chat/[storyId]', params: { storyId: storyDetail.id } });
  }, [storyDetail]);

  return (
    <TouchableOpacity activeOpacity={0.6} onPress={routeToChat} style={[{ padding: pxToDp(32) }, style]}>
      <View style={{ flexDirection: 'row' }}>
        <Avatar img={storyDetail.image} shape="square" size={128} />
        <View style={styles.textInfo}>
          <Text style={[styles.name, { color: '#fff' }]}>{storyDetail.storyName}</Text>
          <Text numberOfLines={2} ellipsizeMode="tail" style={[styles.desc, { color: '#fff' }]}>
            {storyDetail.introduction}
          </Text>
        </View>
      </View>
      <View style={styles.bottom}>
        <View>
          {percent > 0 && (
            <>
              <Text style={[styles.progressText, { color: '#fff' }]}>
                {percent.toFixed(0)}% {intl.formatMessage({ id: 'progress' })}
              </Text>
              <View style={[styles.progressBox, { backgroundColor: computedThemeColor.text_white }]}>
                <View
                  style={[styles.progress, { width: `${percent}%`, backgroundColor: computedThemeColor.text_pink }]}
                />
              </View>
            </>
          )}
        </View>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={routeToChat}
          style={[styles.continue, { borderColor: computedThemeColor.primary }]}>
          <PlayOutline width={pxToDp(32)} height={pxToDp(32)} color={computedThemeColor.primary} />
          <Text style={{ fontSize: pxToDp(28), color: computedThemeColor.primary }}>
            {intl.formatMessage({ id: percent >= 100 ? 'Reread' : 'Continue' })}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default React.memo(StoryCard);
