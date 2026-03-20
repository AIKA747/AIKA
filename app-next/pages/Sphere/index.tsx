import { router } from 'expo-router';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native';
import DropShadow from 'react-native-drop-shadow';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PlushFilled } from '@/components/Icon';
import PageView from '@/components/PageView';
import { Theme, useConfigProvider } from '@/hooks/useConfig';
import pxToDp from '@/utils/pxToDp';

import Ball from './Ball';
import styles from './styles';

export default function Sphere() {
  const intl = useIntl();
  const insets = useSafeAreaInsets();
  const { computedTheme, computedThemeColor } = useConfigProvider();

  return (
    <PageView
      style={[
        {
          flex: 1,
          paddingTop: insets.top,
          backgroundColor: computedTheme === Theme.LIGHT ? '#F6F6F6' : '#0B0C0A',
        },
      ]}
      source={computedTheme === Theme.LIGHT ? require('./bg.png') : require('./bg.dark.png')}
      resizeMode="repeat">
      <View style={{ flex: 1 }}>
        <Ball />
      </View>
      <DropShadow style={styles.fixedBtnBox}>
        <TouchableOpacity
          style={[styles.fixedPostBtn, { backgroundColor: computedThemeColor.primary }]}
          onPress={() => {
            router.push('/main/group-chat/create');
          }}>
          <PlushFilled width={pxToDp(34)} height={pxToDp(34)} color="#ffffff" />
        </TouchableOpacity>
      </DropShadow>
      <View
        style={{
          flex: 0.85,
          flexDirection: 'row',
          paddingHorizontal: pxToDp(32),
          paddingVertical: pxToDp(32),
        }}>
        <TouchableOpacity
          style={[
            {
              flex: 1,
              marginRight: pxToDp(5),
            },
          ]}
          onPress={() => {
            router.push({
              pathname: '/main/fairyTales',
              params: {},
            });
          }}>
          <ImageBackground
            source={require('./fairyTales.png')}
            imageStyle={[styles.blockImage]}
            resizeMode="cover"
            style={[styles.block]}>
            <Text
              style={[
                styles.blockTitle,
                {
                  color: '#fff',
                },
              ]}>
              {intl.formatMessage({ id: 'Sphere.FairyTales' })}
            </Text>
            <Text
              style={[
                styles.blockDesc,
                {
                  color: '#fff',
                },
              ]}>
              {intl.formatMessage({ id: 'Sphere.FairyTales.desc' })}
            </Text>
          </ImageBackground>
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            marginLeft: pxToDp(5),
          }}>
          <TouchableOpacity
            style={[
              {
                flex: 100,
                marginBottom: pxToDp(5),
              },
            ]}
            onPress={() => {
              router.push({
                pathname: '/main/games',
                params: {},
              });
            }}>
            <ImageBackground
              source={require('./games.png')}
              imageStyle={[styles.blockImage]}
              resizeMode="cover"
              style={[styles.block]}>
              <Text
                style={[
                  styles.blockTitle,
                  {
                    color: '#fff',
                  },
                ]}>
                {intl.formatMessage({ id: 'Sphere.Games' })}
              </Text>
              <Text
                style={[
                  styles.blockDesc,
                  {
                    color: '#fff',
                  },
                ]}>
                {intl.formatMessage({ id: 'Sphere.Games.desc' })}
              </Text>
            </ImageBackground>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              {
                flex: 164,
                marginTop: pxToDp(5),
              },
            ]}
            onPress={() => {
              router.push({
                pathname: '/main/experts/category',
                params: {},
              });
            }}>
            <ImageBackground
              source={require('./experts.png')}
              imageStyle={[styles.blockImage]}
              resizeMode="cover"
              style={[styles.block]}>
              <Text
                style={[
                  styles.blockTitle,
                  {
                    color: '#fff',
                  },
                ]}>
                {intl.formatMessage({ id: 'Sphere.Experts' })}
              </Text>
              <Text
                style={[
                  styles.blockDesc,
                  {
                    color: '#fff',
                  },
                ]}>
                {intl.formatMessage({ id: 'Sphere.Experts.desc' })}
              </Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>
      </View>
    </PageView>
  );
}
