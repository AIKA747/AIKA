import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { Modal, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';

import {
  DangerCircleOutline,
  ArrowsActionForwardOutline,
  DeleteOutline,
  CopyOutline,
  EditOutline,
} from '@/components/Icon';
import { Theme, useConfigProvider } from '@/hooks/useConfig';
import pxToDp from '@/utils/pxToDp';

import styles from './styles';
import { MenuModalProps } from './types';

const MenuModal = (props: MenuModalProps) => {
  const { visible, onClose, onAction, item, position, itemPosition = 'left' } = props;
  const intl = useIntl();
  const { computedThemeColor, computedTheme } = useConfigProvider();
  const { width, height } = useWindowDimensions();
  const [containerStyle, setContainerStyle] = useState({});

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
          id: item?.id!,
          itemPosition,
          item,
        });
        onClose(false);
      },
    }),
    [intl, computedThemeColor.text_secondary, onAction, item, itemPosition, onClose],
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
          id: item?.id!,
          itemPosition,
          item,
        });
        onClose(false);
      },
    }),
    [intl, computedThemeColor.text_secondary, onAction, item, itemPosition, onClose],
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
      disable: false,
      onPress: () => {
        onAction({ type: 'reply', id: item?.id!, itemPosition, item });
        onClose(false);
      },
    }),
    [item, onClose, onAction, intl, itemPosition],
  );
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
      disable: false,
      style: {},
      onPress: () => {
        onAction({ type: 'report', id: item?.id!, itemPosition, item });
        onClose(false);
      },
    }),
    [item, onAction, onClose, intl, computedThemeColor, itemPosition],
  );
  const DeleteMenuItem = useMemo(
    () => ({
      label: <Text style={[styles.itemText, { color: '#F10000' }]}>{intl.formatMessage({ id: 'Delete' })}</Text>,
      iconLight: <DeleteOutline width={pxToDp(48)} height={pxToDp(48)} color="#F10000" />,
      iconDark: <DeleteOutline width={pxToDp(48)} height={pxToDp(48)} color="#F10000" />,
      key: 'Delete',
      disable: false,
      onPress: () => {
        onAction({ type: 'delete', id: item?.id!, itemPosition, item });
        onClose(false);
      },
      style: {
        borderTopWidth: pxToDp(2),
        borderColor: computedThemeColor.text_secondary + '20',
      },
    }),
    [onAction, onClose, computedThemeColor, item, intl, itemPosition],
  );
  const menus = useMemo(() => {
    if (itemPosition === 'left') {
      return [CopyMenuItem, ReplyMenuItem, ReportMenuItem];
    }

    const menu = [CopyMenuItem, ReplyMenuItem, DeleteMenuItem];
    if (dayjs().diff(dayjs(item?.createdAt)) < 60000) {
      menu.unshift(EditMenuItem);
    }
    return menu;
  }, [ReportMenuItem, EditMenuItem, item, CopyMenuItem, ReplyMenuItem, DeleteMenuItem, itemPosition]);

  return (
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
            return (
              <TouchableOpacity key={item.key} onPress={item.onPress} style={[styles.item, item?.style]}>
                {computedTheme === Theme.LIGHT && (React.isValidElement(item.iconLight) ? item.iconLight : null)}
                {computedTheme === Theme.DARK && (React.isValidElement(item.iconDark) ? item.iconDark : null)}

                <Text style={[styles.itemText, { color: computedThemeColor.text }]}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default React.memo(MenuModal);
