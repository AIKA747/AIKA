import { router } from 'expo-router';
import { isEmpty } from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { StyleSheet, Pressable, View, Text, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MessageItem } from '@/components/Chat/types';
import { DeleteOutline, ArrowsActionForwardOutline } from '@/components/Icon';
import Modal from '@/components/Modal';
import SearchBar from '@/components/SearchBar';
import { useConfigProvider } from '@/hooks/useConfig';
import pxToDp from '@/utils/pxToDp';

export default function FooterAction({
  selectedItems = [],
  onDelete,
  onReplyMessage,
  onClose,
}: {
  selectedItems?: MessageItem[];
  onReplyMessage: (e: MessageItem) => void;
  onDelete: (e: MessageItem) => Promise<void>;
  onClose?: () => void;
}) {
  const intl = useIntl();
  const insets = useSafeAreaInsets();
  const { computedThemeColor } = useConfigProvider();
  const height = useSharedValue(0);
  const forwardFooterButtonHeight = useSharedValue(0);
  const isOpen = useSharedValue(true);
  const isOpenFooterButton = useSharedValue(false);
  const progress = useDerivedValue(() => withTiming(isOpen.value ? 0 : 1, { duration: 500 }));
  const openFooterButtonProgress = useDerivedValue(() =>
    withTiming(isOpenFooterButton.value ? 0 : 1, { duration: 500 }),
  );
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: progress.value * 2 * height.value }],
  }));
  const forwardFooterButton = useAnimatedStyle(() => ({
    transform: [{ translateY: openFooterButtonProgress.value * 2 * forwardFooterButtonHeight.value }],
  }));

  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openForwardModal, setOpenForwardModal] = useState<boolean>(false);

  const disabledDelect = useMemo(() => isEmpty(selectedItems), [selectedItems]);
  const disabled = useMemo(() => isEmpty(selectedItems) || selectedItems.length !== 1, [selectedItems]);

  const handleDelete = useCallback(async () => {
    for (const item of selectedItems) {
      await onDelete?.(item);
    }
    setOpenDeleteModal((v) => !v);
  }, [selectedItems, onDelete]);

  const handleReplyMessage = useCallback(() => {
    onReplyMessage?.(selectedItems[0]);
  }, [onReplyMessage, selectedItems]);

  const backgroundColorSheetStyle = {
    backgroundColor: computedThemeColor.bg_secondary,
  };

  return (
    <Animated.View
      onLayout={(e) => {
        height.value = e.nativeEvent.layout.height;
      }}
      style={[sheetStyles.sheet, sheetStyle, backgroundColorSheetStyle]}>
      <Animated.View style={sheetStyles.sheetInner}>
        <Pressable
          disabled={disabledDelect}
          style={[sheetStyles.sheetItem, { backgroundColor: computedThemeColor.bg_primary }]}
          onPress={() => {
            setOpenDeleteModal((v) => !v);
          }}>
          <DeleteOutline color={!disabledDelect ? computedThemeColor.text_error : computedThemeColor.text_secondary} />
        </Pressable>
        {/*TODO: 这个功能待确定 */}
        {/*<Pressable
          disabled={disabled}
          style={[sheetStyles.sheetItem, { backgroundColor: computedThemeColor.bg }]}
          onPress={() => {
            setOpenForwardModal((v) => !v);
          }}
        >
          <ArrowsActionUploadOutline
            color={!disabled ? computedThemeColor.white : computedThemeColor.secondText}
          />
        </Pressable>*/}
        <Pressable
          disabled={disabled}
          style={[sheetStyles.sheetItem, { backgroundColor: computedThemeColor.bg_primary }]}
          onPress={handleReplyMessage}>
          <ArrowsActionForwardOutline
            color={!disabled ? computedThemeColor.text_white : computedThemeColor.text_secondary}
          />
        </Pressable>
      </Animated.View>
      <Modal visible={openDeleteModal} fullWidth position="BOTTOM" maskBlur={false}>
        <View
          style={{
            paddingBottom: insets.bottom,
            paddingHorizontal: pxToDp(32),
            paddingTop: pxToDp(32),
            gap: pxToDp(24),
          }}>
          <TouchableOpacity
            style={[sheetStyles.deleteItem, { backgroundColor: computedThemeColor.text_white }]}
            onPress={handleDelete}>
            <Text style={{ color: computedThemeColor.text_error, fontSize: pxToDp(32) }}>
              {intl.formatMessage({ id: 'Delete' })} ( {selectedItems.length} )
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[sheetStyles.deleteItem, { backgroundColor: computedThemeColor.text_gray }]}
            onPress={() => {
              setOpenDeleteModal((v) => !v);
            }}>
            <Text style={{ color: computedThemeColor.text_white, fontSize: pxToDp(32) }}>
              {intl.formatMessage({ id: 'Cancel' })}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal visible={openForwardModal} fullWidth position="BOTTOM" maskBlur={false}>
        <View
          style={{
            backgroundColor: computedThemeColor.bg_primary,
            paddingHorizontal: pxToDp(32),
            paddingTop: pxToDp(32),
            borderTopLeftRadius: pxToDp(32),
            borderTopRightRadius: pxToDp(32),
            height: '100%',
            gap: pxToDp(32),
          }}>
          <View style={sheetStyles.forwardHeader}>
            <Pressable style={sheetStyles.forwardHeaderAction} onPress={() => setOpenForwardModal(false)}>
              <Text style={[sheetStyles.forwardHeaderActionText, { color: computedThemeColor.text_secondary }]}>
                {intl.formatMessage({ id: 'Cancel' })}
              </Text>
            </Pressable>
            <Text style={[sheetStyles.forwardHeaderTitle, { color: computedThemeColor.text_white }]}>Send to</Text>
            <Pressable
              onPress={() => {
                onClose?.();
                router.push('/main/group-chat/create');
              }}>
              <Text style={[sheetStyles.forwardHeaderActionText, { color: computedThemeColor.text_secondary }]}>
                {intl.formatMessage({ id: 'chats.newGroup' })}
              </Text>
            </Pressable>
          </View>
          <SearchBar
            style={{ paddingHorizontal: 0, backgroundColor: 'transparent' }}
            placeholder="Search by name or @username"
          />
          <View
            style={{
              flex: 1,
              backgroundColor: computedThemeColor.text_white,
              paddingBottom: insets.bottom,
            }}>
            <Pressable
              onPress={() => {
                isOpenFooterButton.value = !isOpenFooterButton.value;
              }}>
              <Text>open</Text>
            </Pressable>
          </View>
        </View>
        <Animated.View
          onLayout={(e) => {
            forwardFooterButtonHeight.value = e.nativeEvent.layout.height;
          }}
          style={[
            sheetStyles.forwardFooterButton,
            forwardFooterButton,
            backgroundColorSheetStyle,
            { paddingBottom: insets.bottom },
          ]}>
          <Text style={{ color: computedThemeColor.text_secondary, fontSize: pxToDp(26) }}>A Dimash</Text>
          <Pressable
            onPress={() => {
              isOpenFooterButton.value = !isOpenFooterButton.value;
            }}>
            <Text style={[sheetStyles.forwardFooterButtonText, { color: computedThemeColor.primary }]}>
              {intl.formatMessage({ id: 'Send' })}
            </Text>
          </Pressable>
        </Animated.View>
      </Modal>
    </Animated.View>
  );
}

const sheetStyles = StyleSheet.create({
  sheet: {
    padding: pxToDp(32),
    height: '100%',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetInner: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sheetItem: {
    width: pxToDp(80),
    height: pxToDp(80),
    borderRadius: pxToDp(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteItem: {
    padding: pxToDp(32),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: pxToDp(16),
  },
  forwardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  forwardHeaderAction: {
    paddingVertical: pxToDp(14),
    paddingHorizontal: pxToDp(24),
  },
  forwardHeaderActionText: {
    fontSize: pxToDp(32),
  },
  forwardHeaderTitle: {
    fontSize: pxToDp(46),
  },
  forwardFooterButton: {
    padding: pxToDp(32),
    // height: pxToDp(120),
    width: '100%',
    position: 'absolute',
    bottom: 0,
    borderTopRightRadius: pxToDp(20),
    borderTopLeftRadius: pxToDp(20),
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  forwardFooterButtonText: {
    fontSize: pxToDp(32),
  },
});
