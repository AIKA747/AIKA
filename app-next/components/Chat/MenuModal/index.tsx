import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { Modal, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';

import ForwardModal from '@/components/Chat/ForwardModal';
import {
  ArrowsActionForwardOutline,
  ArrowsRefreshOutline,
  CheckCircleOutline,
  CopyOutline,
  DangerCircleOutline,
  DeleteOutline,
  DislikeOutline,
  EditOutline,
  TextSelectionFilled,
  UndoLeftRoundOutline,
  WeatherStarOutline,
} from '@/components/Icon';
import { ChatModule, ContentType } from '@/hooks/useChatClient';
import { Theme, useConfigProvider } from '@/hooks/useConfig';
import pxToDp from '@/utils/pxToDp';

import { MessageItem } from '../types';

import styles from './styles';
import { MenuModalProps } from './types';

const MenuModal = (props: MenuModalProps) => {
  const { visible, onClose, onAction, listItem, chatModule, position, messagePosition = 'left' } = props;
  const intl = useIntl();
  const { computedThemeColor, computedTheme } = useConfigProvider();
  const { width, height } = useWindowDimensions();
  const [containerStyle, setContainerStyle] = useState({});

  const isGroupChat = chatModule === ChatModule.group;

  useEffect(() => {
    const top = position?.y ?? 0;
    const isButton = top >= height / 2;
    const style = isButton ? { bottom: height - top } : { top };
    if ((position?.x || 0) > width / 2) {
      setContainerStyle({
        right: pxToDp(26),
        ...style,
      });
    } else {
      setContainerStyle({
        left: pxToDp(26),
        ...style,
      });
    }
  }, [width, height, position]);

  const [forwardMsg, setForwardMsg] = useState<MessageItem | null | undefined>(null);

  const EditMenuItem = useMemo(
    () => ({
      label: intl.formatMessage({ id: 'Edit' }),
      iconLight: <EditOutline width={pxToDp(48)} height={pxToDp(48)} color={computedThemeColor.text_secondary} />,
      iconDark: <EditOutline width={pxToDp(48)} height={pxToDp(48)} color={computedThemeColor.text_secondary} />,
      key: 'Edit',
      disable: false,
      style: {},
      onPress: () => {
        onAction({
          type: 'edit',
          msgId: listItem?.msgId!,
          messagePosition,
        });
        onClose(false);
      },
    }),
    [intl, computedThemeColor.text_secondary, onAction, listItem?.msgId, messagePosition, onClose],
  );
  const CopyMenuItem = useMemo(
    () => ({
      label: intl.formatMessage({ id: 'Copy' }),
      iconLight: <CopyOutline width={pxToDp(48)} height={pxToDp(48)} color={computedThemeColor.text_secondary} />,
      iconDark: <CopyOutline width={pxToDp(48)} height={pxToDp(48)} color={computedThemeColor.text_secondary} />,
      key: 'Copy',
      style: {},
      onPress: () => {
        onAction({
          type: 'copy',
          msgId: listItem?.msgId!,
          messagePosition,
        });
        onClose(false);
      },
      disable: listItem?.contentType === ContentType.IMAGE,
    }),
    [
      intl,
      computedThemeColor.text_secondary,
      listItem?.contentType,
      listItem?.msgId,
      onAction,
      messagePosition,
      onClose,
    ],
  );
  const ReplyMenuItem = useMemo(
    () => ({
      label: intl.formatMessage({ id: 'Reply' }),
      iconLight: (
        <ArrowsActionForwardOutline width={pxToDp(48)} height={pxToDp(48)} style={{ transform: [{ scaleX: -1 }] }} />
      ),
      iconDark: (
        <ArrowsActionForwardOutline width={pxToDp(48)} height={pxToDp(48)} style={{ transform: [{ scaleX: -1 }] }} />
      ),
      style: {},
      key: 'Reply',
      disable: listItem?.local?.status === 'FAIL',
      onPress: () => {
        onAction({ type: 'reply', msgId: listItem?.msgId!, messagePosition });
        onClose(false);
      },
    }),
    [listItem, onClose, onAction, intl, messagePosition],
  );
  const ForwardMenuItem = useMemo(
    () => ({
      label: intl.formatMessage({ id: 'Forward' }),
      iconLight: <ArrowsActionForwardOutline height={pxToDp(48)} width={pxToDp(48)} />,
      iconDark: <ArrowsActionForwardOutline height={pxToDp(48)} width={pxToDp(48)} />,
      key: 'Forward',
      disable: listItem?.local?.status === 'FAIL',
      style: {},
      onPress: () => {
        onClose(false);
        setForwardMsg(listItem);
      },
    }),
    [intl, listItem, onClose],
  );
  const ChooseTextMenuItem = useMemo(
    () => ({
      label: intl.formatMessage({ id: 'ChooseText' }),
      iconLight: (
        <TextSelectionFilled width={pxToDp(48)} height={pxToDp(48)} color={computedThemeColor.text_secondary} />
      ),
      iconDark: (
        <TextSelectionFilled width={pxToDp(48)} height={pxToDp(48)} color={computedThemeColor.text_secondary} />
      ),
      disable: listItem?.contentType !== ContentType.TEXT,
      key: 'Choose text',
      style: {},
      onPress: () => {
        onAction({
          type: 'chooseText',
          msgId: listItem?.msgId!,
          messagePosition,
        });
        onClose(false);
      },
    }),
    [intl, computedThemeColor, listItem?.contentType, listItem?.msgId, onAction, messagePosition, onClose],
  );
  const SelectMenuItem = useMemo(
    () => ({
      label: intl.formatMessage({ id: 'Select' }),
      iconLight: (
        <CheckCircleOutline width={pxToDp(48)} height={pxToDp(48)} color={computedThemeColor.text_secondary} />
      ),
      iconDark: <CheckCircleOutline width={pxToDp(48)} height={pxToDp(48)} color={computedThemeColor.text_secondary} />,
      disable: false,
      key: 'Choose text',
      style: {},
      onPress: () => {
        onAction({
          type: 'selected',
          msgId: listItem?.msgId!,
          messagePosition,
        });
        onClose(false);
      },
    }),
    [intl, computedThemeColor, onAction, listItem?.msgId, messagePosition, onClose],
  );
  const RegenerateMenuItem = useMemo(
    () => ({
      label: intl.formatMessage({ id: 'Regenerate' }),
      iconLight: (
        <ArrowsRefreshOutline width={pxToDp(48)} height={pxToDp(48)} color={computedThemeColor.text_secondary} />
      ),
      iconDark: (
        <ArrowsRefreshOutline width={pxToDp(48)} height={pxToDp(48)} color={computedThemeColor.text_secondary} />
      ),
      key: 'Regenerate',
      disable: false,
      style: {},
      onPress: () => {
        onAction({
          type: 'regenerate',
          msgId: listItem?.msgId!,
          messagePosition,
        });
        onClose(false);
      },
    }),
    [intl, computedThemeColor.text_secondary, onAction, listItem?.msgId, messagePosition, onClose],
  );
  const BadAnswerMenuItem = useMemo(
    () => ({
      label: intl.formatMessage({ id: 'BadAnswer' }),
      iconLight: <DislikeOutline width={pxToDp(48)} height={pxToDp(48)} color={computedThemeColor.text_secondary} />,
      iconDark: <DislikeOutline width={pxToDp(48)} height={pxToDp(48)} color={computedThemeColor.text_secondary} />,
      key: 'Bad answer',
      disable: listItem?.badAnswer,
      style: {},
      onPress: () => {
        onAction({
          type: 'badAnswer',
          msgId: listItem?.msgId!,
          messagePosition,
        });
        onClose(false);
      },
    }),
    [intl, computedThemeColor.text_secondary, listItem?.badAnswer, listItem?.msgId, onAction, messagePosition, onClose],
  );
  const AddToFavoriteMenuItem = useMemo(
    () => ({
      label: intl.formatMessage({ id: 'menu.addToFavorite' }),
      iconLight: <WeatherStarOutline width={pxToDp(48)} height={pxToDp(48)} />,
      iconDark: <WeatherStarOutline width={pxToDp(48)} height={pxToDp(48)} />,
      key: 'AddToFavorites',
      disable: listItem?.local?.status === 'FAIL',
      style: {},
      onPress: () => {
        onAction({ type: 'addToFavorites', msgId: listItem?.msgId!, messagePosition });
        onClose(false);
      },
    }),
    [onAction, onClose, listItem, intl, messagePosition],
  );
  /**
   * @Deprecated: 后续移除
   */
  const ReportMenuItem = useMemo(
    () => ({
      label: intl.formatMessage({ id: 'Report' }),
      iconLight: (
        <DangerCircleOutline width={pxToDp(48)} height={pxToDp(48)} color={computedThemeColor.text_secondary} />
      ),
      iconDark: (
        <DangerCircleOutline width={pxToDp(48)} height={pxToDp(48)} color={computedThemeColor.text_secondary} />
      ),
      key: 'Report',
      disable: listItem?.local?.status === 'FAIL',
      style: {},
      onPress: () => {
        onAction({ type: 'report', msgId: listItem?.msgId!, messagePosition });
        onClose(false);
      },
    }),
    [listItem, onAction, onClose, intl, computedThemeColor, messagePosition],
  );
  const UndoItem = useMemo(
    () => ({
      label: intl.formatMessage({ id: 'Recall' }),
      iconLight: (
        <UndoLeftRoundOutline width={pxToDp(48)} height={pxToDp(48)} color={computedThemeColor.text_secondary} />
      ),
      iconDark: (
        <UndoLeftRoundOutline width={pxToDp(48)} height={pxToDp(48)} color={computedThemeColor.text_secondary} />
      ),
      key: 'Undo',
      disable: dayjs().diff(dayjs(listItem?.createdAt)) >= 60000 * 2 || listItem?.local?.status === 'FAIL',
      style: {},
      onPress: () => {
        onAction({ type: 'undo', msgId: listItem?.msgId!, messagePosition });
        onClose(false);
      },
    }),
    [listItem, onAction, onClose, intl, computedThemeColor, messagePosition],
  );
  const DeleteMenuItem = useMemo(
    () => ({
      label: <Text style={[styles.itemText, { color: '#F10000' }]}>{intl.formatMessage({ id: 'Delete' })}</Text>,
      iconLight: <DeleteOutline width={pxToDp(48)} height={pxToDp(48)} color="#F10000" />,
      iconDark: <DeleteOutline width={pxToDp(48)} height={pxToDp(48)} color="#F10000" />,
      key: 'Delete',
      disable: false,
      onPress: () => {
        onAction({ type: 'delete', msgId: listItem?.msgId!, messagePosition });
        onClose(false);
      },
      style: {
        borderTopWidth: pxToDp(2),
        borderColor: computedThemeColor.text_secondary + '20',
      },
    }),
    [onAction, onClose, computedThemeColor, listItem, intl, messagePosition],
  );
  const menus = useMemo(() => {
    switch (chatModule) {
      case ChatModule.group: {
        const menu = [
          CopyMenuItem,
          ReplyMenuItem,
          ForwardMenuItem,
          SelectMenuItem,
          AddToFavoriteMenuItem,
          DeleteMenuItem,
        ];
        if (messagePosition === 'right') {
          delete menu[0];
          menu.unshift(UndoItem);
          menu.unshift(CopyMenuItem);
        }
        return menu;
      }
      case ChatModule.bot:
        if (messagePosition === 'left')
          return [CopyMenuItem, ChooseTextMenuItem, RegenerateMenuItem, BadAnswerMenuItem];
        return [EditMenuItem, RegenerateMenuItem, CopyMenuItem];
      case ChatModule.game:
      case ChatModule.story:
        if (messagePosition === 'left') return [CopyMenuItem, ChooseTextMenuItem];
        return [EditMenuItem, CopyMenuItem];
      default:
        return [CopyMenuItem];
    }
  }, [
    ChooseTextMenuItem,
    chatModule,
    messagePosition,
    CopyMenuItem,
    SelectMenuItem,
    RegenerateMenuItem,
    BadAnswerMenuItem,
    EditMenuItem,
    ReplyMenuItem,
    ForwardMenuItem,
    AddToFavoriteMenuItem,
    DeleteMenuItem,
    UndoItem,
  ]);

  return (
    <>
      <Modal
        animationType="fade"
        transparent
        visible={visible}
        onRequestClose={() => {
          onClose(false);
        }}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => {
            onClose(false);
          }}>
          <View
            style={[
              styles.menu,
              {
                backgroundColor: computedThemeColor.bg_primary,
                ...containerStyle,
              },
            ]}>
            {menus.map((item) => {
              if (item?.disable) {
                return null;
              }
              return (
                <TouchableOpacity key={item.key} onPress={item.onPress} style={[styles.item, item?.style]}>
                  {computedTheme === Theme.LIGHT && item.iconLight}
                  {computedTheme === Theme.DARK && item.iconDark}
                  <Text style={[styles.itemText, { color: computedThemeColor.text }]}>{item.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>

      <ForwardModal message={forwardMsg} onClose={() => setForwardMsg(null)} handleInputSend={props.handleInputSend} />
    </>
  );
};

export default React.memo(MenuModal);
