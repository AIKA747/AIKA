import { router } from 'expo-router';
import { Fragment, useRef } from 'react';
import { useIntl } from 'react-intl';
import { TouchableOpacity, View, Text, ImageBackground } from 'react-native';

import { PlayOutline } from '@/components/Icon';
import List from '@/components/List';
import { ListRef } from '@/components/List/types';
import { Theme, useConfigProvider } from '@/hooks/useConfig';
import { getContentAppStory } from '@/services/gushichaxun';
import pxToDp from '@/utils/pxToDp';
import s3ImageTransform from '@/utils/s3ImageTransform';

import styles from './styles';

export default function Progress() {
  const { computedThemeColor, computedTheme } = useConfigProvider();
  const intl = useIntl();

  const listRef = useRef<ListRef>(null);

  return (
    <>
      <List
        ref={listRef}
        footerProps={{
          noMoreText: '',
        }}
        request={async (params) => {
          const resp = await getContentAppStory({
            pageNo: params.pageNo,
            pageSize: 10,
            statusList: 'PLAYING,FAIL,SUCCESS',
          });
          return {
            data: resp.data.data.list || [],
            total: resp.data.data.total || 0,
          };
        }}
        contentContainerStyle={styles.List}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, isLast, index }) => {
          const percent = (item.storyProcess || 0) * 100;
          return (
            <Fragment key={item.id}>
              <View
                style={[
                  styles.ListItemWrapper,
                  isLast ? { height: pxToDp(610 - 80), overflow: 'hidden', borderRadius: pxToDp(40) } : {},
                  index === 0 ? { marginTop: -pxToDp(80) } : {},
                  { zIndex: index + 1 },
                ]}>
                <TouchableOpacity
                  style={[styles.ListItem]}
                  activeOpacity={0.99}
                  onPress={() => {
                    router.push({
                      pathname: '/main/story/summary/[storyId]',
                      params: {
                        storyId: item.id,
                      },
                    });
                  }}>
                  <ImageBackground
                    source={{
                      uri: s3ImageTransform(
                        item?.processCover || (computedTheme === Theme.DARK ? item.listCoverDark : item.listCover),
                        [686, 520],
                      ),
                    }}
                    style={styles.ListItemBg}
                    resizeMode="cover"
                    imageStyle={[
                      styles.ListItemImage,
                      {
                        backgroundColor: computedThemeColor.bg_secondary,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.ListItemTitle,
                        {
                          color: computedThemeColor.text_progress,
                        },
                      ]}
                      numberOfLines={2}
                      ellipsizeMode="tail">
                      {/*{item.storyName}*/}{' '}
                    </Text>
                    <Text
                      style={[
                        styles.ListItemProgressTitle,
                        {
                          color: computedThemeColor.text_progress,
                        },
                      ]}>
                      {percent.toFixed(0)}% {intl.formatMessage({ id: 'FairyTales.progress' })}
                    </Text>
                    <View
                      style={[
                        styles.ListItemProgress,
                        {
                          backgroundColor: computedThemeColor.text_white,
                          borderColor: computedThemeColor.text_white,
                        },
                      ]}>
                      <View
                        style={[
                          styles.ListItemProgressInner,
                          {
                            backgroundColor: computedThemeColor.text_pink,
                            width: `${percent}%`,
                          },
                        ]}
                      />
                    </View>
                    <View
                      style={[
                        styles.ListItemButton,
                        {
                          borderColor: computedThemeColor.primary,
                        },
                      ]}>
                      <PlayOutline
                        width={pxToDp(32)}
                        height={pxToDp(32)}
                        color={computedThemeColor.primary}
                        style={[styles.ListItemButtonIcon]}
                      />
                      <Text
                        style={[
                          styles.ListItemButtonText,
                          {
                            color: computedThemeColor.primary,
                          },
                        ]}>
                        {intl.formatMessage({ id: 'FairyTales.Continue' })}
                      </Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              </View>
            </Fragment>
          );
        }}
      />
    </>
  );
}
