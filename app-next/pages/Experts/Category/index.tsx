import { router } from 'expo-router';
import { useRef } from 'react';
import { useIntl } from 'react-intl';
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

import List from '@/components/List';
import { ListRef } from '@/components/List/types';
import NavBar from '@/components/NavBar';
import { placeholderImg } from '@/constants';
import KeyboardAvoidingViewBehavior from '@/constants/KeyboardAvoidingViewBehavior';
import { useConfigProvider } from '@/hooks/useConfig';
import { getBotAppBotCategory } from '@/services/jiqirenchaxun';
import pxToDp from '@/utils/pxToDp';
import s3ImageTransform from '@/utils/s3ImageTransform';

import styles from './styles';

export default function ExpertCategory() {
  const intl = useIntl();
  const { computedThemeColor } = useConfigProvider();
  const listRef = useRef<ListRef>(null);

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
              {intl.formatMessage({ id: 'Experts' })}
            </Text>
          </View>
        }
      />
      <View style={[styles.container]}>
        <List
          numColumns={2}
          ref={listRef}
          footerProps={{
            noMoreText: '',
          }}
          request={async (params) => {
            const resp = await getBotAppBotCategory({
              pageNo: params.pageNo,
              pageSize: 10,
            });

            const data = resp.data.data.list || [];
            return {
              data,
              total: resp.data.data.total || 0,
            };
          }}
          contentContainerStyle={styles.List}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                style={[
                  styles.ListItem,
                  index % 2 === 0
                    ? {
                        marginRight: pxToDp(10),
                      }
                    : {
                        marginLeft: pxToDp(10),
                      },
                ]}
                onPress={() => {
                  router.push({
                    pathname: '/main/experts/[categoryId]',
                    params: {
                      from: 'category',
                      categoryId: item.id,
                      categoryName: item.categoryName,
                    },
                  });
                }}>
                <ImageBackground
                  source={item.cover ? { uri: s3ImageTransform(item.cover, [332, 280]) } : placeholderImg}
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
                      styles.ListItemText,
                      {
                        color: computedThemeColor.text,
                      },
                    ]}>
                    {item.categoryName}
                  </Text>
                </ImageBackground>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
