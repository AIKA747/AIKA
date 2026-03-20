import React, { ReactNode, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// 导入所有组件
import * as AllComponents from '@/components/Icon';
import { useConfigProvider } from '@/hooks/useConfig';
import pxToDp from '@/utils/pxToDp';

const ComponentsGallery = () => {
  const { computedThemeColor } = useConfigProvider();
  const [loading, setLoading] = useState<boolean>(true);
  const [components, setComponents] = useState<{ name: string; Component: ReactNode }[]>([]);

  useEffect(() => {
    // 模拟加载过程
    setTimeout(() => {
      // 将组件对象转换为数组
      const componentArray = Object.keys(AllComponents).map((key: any) => ({
        name: key,
        Component: AllComponents[key] as ReactNode,
      }));

      setComponents(componentArray);
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={computedThemeColor.primary} />
        <Text style={styles.loadingText}>Loading Components...</Text>
      </View>
    );
  }

  const renderComponentItem = ({ item }: any) => (
    <TouchableOpacity style={styles.item}>
      <View style={styles.componentContainer}>
        {React.createElement(item.Component, {
          width: pxToDp(60),
          height: pxToDp(60),
          color: computedThemeColor.primary,
          twoToneColor: computedThemeColor.text,
          checked: true,
          loading: true,
        })}
      </View>
      <Text style={styles.itemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={[styles.title, { color: computedThemeColor.primary }]}>Icons Components Gallery</Text>
      <Text style={styles.subtitle}>{components.length} components available</Text>

      <View style={styles.content}>
        <View style={styles.preview}>
          <FlatList
            data={components}
            numColumns={3}
            renderItem={renderComponentItem}
            keyExtractor={(item) => item.name}
            contentContainerStyle={styles.list}
            ListHeaderComponentStyle={{
              flex: 1,
              marginHorizontal: pxToDp(24),
              backgroundColor: computedThemeColor.toast_success_bg,
              borderRadius: pxToDp(12),
              padding: pxToDp(14),
            }}
            ListHeaderComponent={() => (
              <View>
                <Text style={{ fontSize: pxToDp(24) }}>部分功能图标说明：</Text>
                <Text style={styles.componentTips}>
                  “CheckboxTwoTone”、“RadioCheckTwoTone”、“RadioCheckOutline” 具有选中和未选中的属性
                  "checked"，可以控制图标的状态。
                </Text>
                <Text style={styles.componentTips}>
                  “ArrowsRefreshOutline”、“LoadingOutline”、“RestartOutline” 具有加载状态属性
                  "loading"，可以控制图标的状态。
                </Text>
              </View>
            )}
            ItemSeparatorComponent={() => (
              <View style={{ width: pxToDp(10), flex: 1, height: '100%', backgroundColor: 'red' }} />
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
  },
  subtitle: {
    textAlign: 'center',
    color: '#7f8c8d',
    marginBottom: 20,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  list: {
    paddingVertical: 10,
  },
  item: {
    flex: 1,
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemText: {
    fontSize: pxToDp(22),
    marginTop: pxToDp(20),
    textAlign: 'center',
  },
  preview: {
    flex: 1,
  },
  componentTips: {
    fontSize: pxToDp(24),
    color: '#e74c3c',
    marginTop: pxToDp(10),
  },
  previewContent: {
    padding: 20,
    alignItems: 'center',
  },
  componentContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  componentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#3498db',
    textAlign: 'center',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 18,
    color: '#95a5a6',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 18,
    color: '#7f8c8d',
  },
});

export default ComponentsGallery;
