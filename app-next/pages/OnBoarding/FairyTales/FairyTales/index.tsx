import { FlashList } from '@shopify/flash-list';
import { router, useGlobalSearchParams } from 'expo-router';
import * as React from 'react';
import { useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { CopilotStep, useCopilot, walkthroughable } from 'react-native-copilot';

import { ListRef } from '@/components/List/types';
import PageView from '@/components/PageView';
import SearchBar from '@/components/SearchBar';
import { useConfigProvider } from '@/hooks/useConfig';
import { capitalizeFirstLetter } from '@/utils';
import pxToDp from '@/utils/pxToDp';

import styles from './styles';

const WalkthroughableView = walkthroughable(View);

const categoryList = [
  { id: 1, name: 'Popular' },
  { id: 2, name: 'Fiction' },
  { id: 3, name: 'Drama' },
  { id: 4, name: 'Psychology' },
  { id: 5, name: 'Thriller' },
];
export default function FairyTales() {
  const intl = useIntl();
  const { computedThemeColor } = useConfigProvider();
  const { start, goToNth, currentStepNumber } = useCopilot();
  const { from } = useGlobalSearchParams<{
    from: 'sphere';
    sphereId: string;
    sphereName: string;
    categoryId: string;
  }>();

  const listRef = useRef<ListRef>(null);

  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number | null>(null);

  return (
    <PageView style={{ flex: 1 }}>
      {from !== 'sphere' ? (
        <SearchBar
          style={{ marginBottom: pxToDp(30), paddingHorizontal: pxToDp(32) }}
          onSearch={(keywords) => {
            listRef.current?.reload();
          }}
        />
      ) : undefined}

      {categoryList?.length ? (
        <View style={[styles.tagsWrapper]}>
          <ScrollView horizontal style={[styles.tags]} showsHorizontalScrollIndicator={false}>
            {categoryList.map((tag, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.tag,
                    {
                      backgroundColor:
                        activeCategoryIndex === index ? 'rgba(160, 123, 237, 0.1)' : 'rgba(27, 27, 34, 1)',
                      marginRight: index === categoryList.length - 1 ? 0 : pxToDp(10),
                    },
                  ]}
                  onPress={() => {
                    if (activeCategoryIndex === index) {
                      setActiveCategoryIndex(null);
                    } else {
                      setActiveCategoryIndex(index);
                    }
                    listRef.current?.reload();
                  }}>
                  <Text
                    style={[
                      styles.tagText,
                      {
                        color: activeCategoryIndex === index ? '#A07BED' : '#80878E',
                      },
                    ]}>
                    {capitalizeFirstLetter(tag.name)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      ) : undefined}

      <View style={{ flex: 1 }}>
        <FlashList<any>
          numColumns={2}
          data={[
            {
              id: 1,
              name: 'Shadows of Greatness',
              listCover: require('@/assets/images/onboarding/fairy-tales/01.png'),
            },
            {
              id: 2,
              name: 'Digital Soul',
              listCover: require('@/assets/images/onboarding/fairy-tales/02.png'),
            },
            {
              id: 3,
              name: 'Seams of Freedom',
              listCover: require('@/assets/images/onboarding/fairy-tales/03.png'),
            },
            {
              id: 4,
              name: 'Melodies of the Heart',
              listCover: require('@/assets/images/onboarding/fairy-tales/04.png'),
            },
            {
              id: 5,
              name: 'Honor and Desire',
              listCover: require('@/assets/images/onboarding/fairy-tales/05.png'),
            },
            {
              id: 6,
              name: 'Shadows to Strength',
              listCover: require('@/assets/images/onboarding/fairy-tales/06.png'),
            },
            {
              id: 7,
              name: 'Veil of Secrets',
              listCover: require('@/assets/images/onboarding/fairy-tales/07.png'),
            },
            {
              id: 8,
              name: 'Armor and heart',
              listCover: require('@/assets/images/onboarding/fairy-tales/08.png'),
            },
            {
              id: 9,
              name: 'Guns and Roses',
              listCover: require('@/assets/images/onboarding/fairy-tales/09.png'),
            },
            {
              id: 10,
              name: 'Hidden Gift',
              listCover: require('@/assets/images/onboarding/fairy-tales/10.png'),
            },
          ]}
          contentContainerStyle={styles.List}
          renderItem={({ item, index }) => {
            const isStory = 'storyName' in item;
            const itemInnerContent = (
              <ImageBackground
                source={item.listCover}
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
                  {/*{isStory ? item.storyName : item.name}*/}
                </Text>
              </ImageBackground>
            );
            if (index === 0) {
              return (
                <View
                  onLayout={() => {
                    requestAnimationFrame(() => {
                      start();
                      goToNth(7);
                    });
                  }}>
                  <CopilotStep text={intl.formatMessage({ id: 'copilot.fairy-tales-item' })} order={7} name={item.name}>
                    <WalkthroughableView
                      style={[
                        styles.ListItem,
                        index % 2 === 0
                          ? {
                              marginRight: pxToDp(11),
                            }
                          : {
                              marginLeft: pxToDp(11),
                            },
                      ]}>
                      {itemInnerContent}
                    </WalkthroughableView>
                  </CopilotStep>
                </View>
              );
            }
            return (
              <TouchableOpacity
                style={[
                  styles.ListItem,
                  index % 2 === 0
                    ? {
                        marginRight: pxToDp(11),
                      }
                    : {
                        marginLeft: pxToDp(11),
                      },
                ]}
                onPress={() => {
                  router.push({
                    pathname: `/main/story/summary/[storyId]`,
                    params: {
                      storyId: isStory ? item.id : item.botId,
                    },
                  });
                }}>
                {itemInnerContent}
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </PageView>
  );
}
