import { router } from 'expo-router';
import React from 'react';
import { useIntl } from 'react-intl';
import { Text, TouchableOpacity, View } from 'react-native';

import Avatar from '@/components/Avatar';
import { PlayOutline } from '@/components/Icon';
import List from '@/components/List';
import { Theme, useConfigProvider } from '@/hooks/useConfig';
import { getContentAppStory } from '@/services/gushichaxun';
import pxToDp from '@/utils/pxToDp';

import styles from './styles';

function FairyTales() {
  const { computedThemeColor, computedTheme } = useConfigProvider();
  const intl = useIntl();
  return (
    <View style={styles.page}>
      <List
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
        ItemSeparatorComponent={() => (
          <View
            style={{
              backgroundColor: computedThemeColor.bg_secondary,
              height: pxToDp(1),
              flex: 1,
              marginTop: pxToDp(34),
              marginBottom: pxToDp(24),
            }}
          />
        )}
        renderItem={({ item }) => {
          const percent = (item.storyProcess || 0) * 100;
          return (
            <View style={[styles.ListItemWrapper]}>
              <TouchableOpacity
                style={[styles.ListItem]}
                activeOpacity={0.6}
                onPress={() => {
                  router.push({
                    pathname: '/main/story/summary/[storyId]',
                    params: {
                      storyId: item.id,
                    },
                  });
                }}>
                <View style={{ flexDirection: 'row', gap: pxToDp(24), paddingVertical: pxToDp(12) }}>
                  <Avatar
                    img={computedTheme === Theme.DARK ? item.listCoverDark : item.listCover}
                    style={styles.ListItemCover}
                    size={120}
                  />
                  <View style={{ flex: 1, gap: pxToDp(12) }}>
                    <Text
                      style={[
                        styles.ListItemTitle,
                        {
                          color: computedThemeColor.text,
                        },
                      ]}
                      numberOfLines={1}
                      ellipsizeMode="tail">
                      {item.storyName}
                    </Text>
                    <Text
                      style={[
                        styles.ListItemIntroduction,
                        {
                          color: computedThemeColor.text,
                        },
                      ]}
                      numberOfLines={2}
                      ellipsizeMode="tail">
                      {item.introduction}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    gap: pxToDp(24),
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                  }}>
                  {percent > 0 ? (
                    <View>
                      <Text
                        style={[
                          styles.ListItemProgressTitle,
                          {
                            color: computedThemeColor.text,
                          },
                        ]}>
                        {percent.toFixed(0)}% {intl.formatMessage({ id: 'FairyTales.progress' })}
                      </Text>
                      <View style={[styles.ListItemProgress]}>
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
                    </View>
                  ) : (
                    <View />
                  )}
                  <View
                    style={[
                      styles.ListItemButton,
                      {
                        borderColor: computedThemeColor.primary,
                      },
                    ]}>
                    <PlayOutline
                      width={pxToDp(28)}
                      height={pxToDp(28)}
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
                      {intl.formatMessage({
                        id: percent >= 100 ? 'FairyTales.Reread' : 'FairyTales.Continue',
                      })}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
}

export default React.memo(FairyTales);
