import { router, useGlobalSearchParams } from 'expo-router';
import { Fragment, useRef } from 'react';
import { useIntl } from 'react-intl';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

import { PlayOutline } from '@/components/Icon';
import List from '@/components/List';
import { ListRef } from '@/components/List/types';
import NavBar from '@/components/NavBar';
import KeyboardAvoidingViewBehavior from '@/constants/KeyboardAvoidingViewBehavior';
import { useConfigProvider } from '@/hooks/useConfig';
import { getBotAppSphereBot } from '@/services/spherexin';
import { getBotAppGame } from '@/services/youxi';
import pxToDp from '@/utils/pxToDp';
import s3ImageTransform from '@/utils/s3ImageTransform';

import styles from './styles';
import { GameItem } from './types';

export default function Games() {
  const { computedThemeColor } = useConfigProvider();
  const intl = useIntl();

  const listRef = useRef<ListRef>(null);

  const { from, sphereId } = useGlobalSearchParams<{
    from: 'sphere';
    sphereId: string;
    sphereName: string;
  }>();

  return (
    <KeyboardAvoidingView
      behavior={KeyboardAvoidingViewBehavior}
      style={[
        styles.page,
        {
          backgroundColor: computedThemeColor.bg_primary,
        },
      ]}>
      <NavBar
        title={
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text
              style={{
                color: computedThemeColor.text,
                fontFamily: 'ProductSansBold',
                fontSize: pxToDp(32),
              }}>
              {intl.formatMessage({ id: 'ExploreYourself' })}
            </Text>
          </View>
        }
      />
      <View style={[styles.container]}>
        <List<GameItem>
          ref={listRef}
          request={async (params) => {
            const resp =
              from === 'sphere'
                ? await getBotAppSphereBot({
                    pageNo: params.pageNo,
                    pageSize: 10,
                    collectionId: sphereId,
                  })
                : await getBotAppGame({
                    pageNo: params.pageNo,
                    pageSize: 10,
                  });

            const data = (resp.data.data.list || []) as GameItem[];

            return {
              data,
              total: resp.data.data.total || 0,
            };
          }}
          footerProps={{
            noMoreText: '',
          }}
          contentContainerStyle={styles.List}
          renderItem={({ item }) => {
            const isGame = 'gameName' in item;
            return (
              <Fragment key={item.id}>
                <TouchableOpacity
                  activeOpacity={0.6}
                  style={[styles.ListItem, { borderColor: '#0B0C0A0D' }]}
                  onPress={() => {
                    router.push({
                      pathname: '/main/games/details/[gameId]',
                      params: {
                        gameId: isGame ? item.id : item.botId,
                      },
                    });
                  }}>
                  <ImageBackground
                    source={{ uri: s3ImageTransform(item.listCover, [686, 632]) }}
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
                          color: computedThemeColor.text,
                        },
                      ]}>
                      {isGame ? item.gameName : item.name}
                    </Text>
                    <Text
                      style={[
                        styles.ListItemDesc,
                        {
                          color: computedThemeColor.text,
                        },
                      ]}
                      numberOfLines={5}>
                      {isGame ? item.listDesc : item.description}
                    </Text>
                    <View
                      style={[
                        styles.ListItemButton,
                        {
                          borderColor: '#A07BED',
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
                        {intl.formatMessage({ id: 'Start' })}
                      </Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              </Fragment>
            );
          }}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
