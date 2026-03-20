import { useRequest } from 'ahooks';
import React from 'react';
import { useIntl } from 'react-intl';
import { Share, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { RootSiblingPortal } from 'react-native-root-siblings';

import {
  DangerTriangleOutline,
  DeleteOutline,
  LoadingOutline,
  SecurityEyeClosedOutline,
  ShareOutline,
} from '@/components/Icon';
import { SHARE_EXTERNAL_LINK_HOST } from '@/constants';
import { AFEventKey } from '@/constants/AFEventKey';
import { useConfigProvider } from '@/hooks/useConfig';
import { deleteContentAppPostsId } from '@/services/tiezi';
import { sendAppsFlyerEvent } from '@/utils/appsFlyerEvent';
import pxToDp from '@/utils/pxToDp';

import styles from './styles';
import { MoreProps, PostMoreAction } from './types';

const More = ({ visible, onClose, nativeEvent, navBarMoreItems, post }: MoreProps) => {
  const intl = useIntl();
  const { computedThemeColor } = useConfigProvider();
  const { height } = useWindowDimensions();
  const { loading: removeLoading, runAsync: removeContentAppPostsId } = useRequest(deleteContentAppPostsId, {
    manual: true,
    debounceWait: 300,
  });

  if (!visible) {
    return null;
  }

  return (
    <RootSiblingPortal>
      <View
        style={[styles.containerWrapper]}
        onTouchEnd={() => {
          onClose?.();
        }}>
        <View
          style={[
            styles.container,
            {
              right: pxToDp(32),
              backgroundColor: 'rgba(27, 27, 34, 1)',
            },
            height / 2 > nativeEvent?.pageY
              ? { top: pxToDp(52) + nativeEvent?.pageY }
              : { bottom: height - nativeEvent?.pageY + pxToDp(52) },
          ]}
          onTouchEnd={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}>
          {navBarMoreItems &&
            navBarMoreItems?.map((item, index) => {
              if (item === PostMoreAction.Share) {
                return (
                  <TouchableOpacity
                    key={item}
                    style={styles.moreActionItem}
                    onPress={async () => {
                      try {
                        // https://reactnative.cn/docs/0.72/share
                        const result = await Share.share(
                          {
                            message: `https://${SHARE_EXTERNAL_LINK_HOST}/agora/${post?.id}`,
                            title: post?.title || '',
                          },
                          {
                            dialogTitle: post?.title,
                            subject: `https://${SHARE_EXTERNAL_LINK_HOST}/agora/${post?.id}`,
                          },
                        );
                        if (result.action === Share.sharedAction) {
                          sendAppsFlyerEvent(AFEventKey.AFAgoraPostShared);
                          if (result.activityType) {
                            // shared with activity type of result.activityType
                            console.log('shared with activity type of :', result.activityType);
                          } else {
                            // shared
                            console.log('shared');
                          }
                        } else if (result.action === Share.dismissedAction) {
                          // dismissed
                          console.log('dismissed');
                        }
                      } catch (error) {
                        console.log('Share error:', error);
                      }
                      onClose(PostMoreAction.Share);
                    }}>
                    <ShareOutline width={pxToDp(44)} height={pxToDp(44)} color="rgba(128, 135, 142, 1)" />
                    <Text
                      style={[
                        styles.moreActionItemText,
                        {
                          color: computedThemeColor.text,
                        },
                      ]}>
                      {intl.formatMessage({ id: 'agora.more.modal.share' })}
                    </Text>
                  </TouchableOpacity>
                );
              }
              if (item === PostMoreAction.Report) {
                return (
                  <TouchableOpacity
                    key={item}
                    style={styles.moreActionItem}
                    onPress={() => {
                      onClose(PostMoreAction.Report);
                    }}>
                    <DangerTriangleOutline width={pxToDp(44)} height={pxToDp(44)} color="rgba(128, 135, 142, 1)" />
                    <Text
                      style={[
                        styles.moreActionItemText,
                        {
                          color: computedThemeColor.text,
                        },
                      ]}>
                      {intl.formatMessage({ id: 'agora.more.modal.report' })}
                    </Text>
                  </TouchableOpacity>
                );
              }
              if (item === PostMoreAction.Delete || item === PostMoreAction.Hide) {
                return (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.moreActionItem,
                      index > 0 && item === PostMoreAction.Delete ? styles.moreActionItemTopBorder : {},
                    ]}
                    disabled={removeLoading}
                    onPress={() => {
                      removeContentAppPostsId({ id: String(post.id) }).then((res) => {
                        if (res.data.code === 0) {
                          onClose(PostMoreAction.Delete);
                        }
                      });
                    }}>
                    {removeLoading ? (
                      <LoadingOutline width={pxToDp(44)} height={pxToDp(44)} color={computedThemeColor.primary} />
                    ) : item === PostMoreAction.Hide ? (
                      <SecurityEyeClosedOutline width={pxToDp(44)} height={pxToDp(44)} color="rgba(128, 135, 142, 1)" />
                    ) : (
                      <DeleteOutline width={pxToDp(44)} height={pxToDp(44)} color="rgba(241, 0, 0, 1)" />
                    )}
                    <Text
                      style={[
                        styles.moreActionItemText,
                        {
                          color: item === PostMoreAction.Hide ? computedThemeColor.text : 'rgba(241, 0, 0, 1)',
                        },
                      ]}>
                      {item === PostMoreAction.Hide
                        ? intl.formatMessage({
                            id: 'agora.more.modal.hide',
                          })
                        : intl.formatMessage({
                            id: 'agora.more.modal.delete',
                          })}
                    </Text>
                  </TouchableOpacity>
                );
              }
            })}
        </View>
      </View>
    </RootSiblingPortal>
  );
};

export default React.memo(More);
