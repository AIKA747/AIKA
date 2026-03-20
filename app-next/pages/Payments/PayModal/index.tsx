import { useRequest } from 'ahooks';
import dayjs from 'dayjs';
import { ErrorCode, useIAP } from 'expo-iap';
import type { Purchase, Product, IapPlatform } from 'expo-iap';
import { Platform } from 'expo-modules-core';
import { isEmpty } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

import { CheckboxTwoTone } from '@/components/Icon';
import Modal from '@/components/Modal';
import Toast from '@/components/Toast';
import { AFEventKey } from '@/constants/AFEventKey';
import { useConfigProvider } from '@/hooks/useConfig';
import { postOrderAppGoogleInAppPurchase, postOrderAppGoogleInAppPurchaseCheck } from '@/services/googleneigou';
import { getOrderAppPaymentResult, getOrderAppServicePackages, postOrderAppPlaceOrder } from '@/services/orderService';
import { postOrderAppInAppPurchase, postOrderAppInAppPurchaseCheckV2 } from '@/services/pingguoneigouIap';
import { sendAppsFlyerEvent } from '@/utils/appsFlyerEvent';
import pxToDp from '@/utils/pxToDp';

import styles, { itemStyle, itemStyleChecked } from './styles';
import { type PayIAPData, PayModalProps } from './types';

export default function PayModal({ visible, onClose, from, chatModule }: PayModalProps) {
  const intl = useIntl();
  const { computedThemeColor } = useConfigProvider();
  const {
    connected,
    products,
    fetchProducts,
    requestPurchase,
    getAvailablePurchases,
    validateReceipt,
    finishTransaction,
  } = useIAP({
    onPurchaseSuccess: (purchase) => {
      console.log('onPurchaseSuccess:', purchase);
      handleCompletePurchase(purchase);
    },
    onPurchaseError: (error) => {
      console.log('onPurchaseError', error);
      switch (error.code) {
        case ErrorCode.UserCancelled:
          // User cancelled - no action needed
          console.log('User cancelled - no action needed');
          break;
        case ErrorCode.ItemUnavailable:
          Alert.alert('Product Unavailable', 'This item is not available for purchase');
          break;
        case ErrorCode.ServiceError:
          Alert.alert('Service Error', 'Google Play services are unavailable');
          break;
        case ErrorCode.DeveloperError:
          Alert.alert('Configuration Error', 'Please contact support');
          break;
        case ErrorCode.BillingUnavailable:
          Alert.alert('Purchases are not allowed on this device');
          break;
        case ErrorCode.PurchaseError:
          Alert.alert('Invalid payment information');
          break;
        default:
          Alert.alert('Purchase Failed', error.message);
      }
    },
    onPromotedProductIOS: (product: Product) => {
      console.log('product:', product);
    },
  });
  const [checkId, setCheckId] = useState<string>();
  const [currentIAPOrderData, setCurrentIAPOrderData] = useState<PayIAPData>();

  const { data: packageList = [], refreshAsync } = useRequest(async () => {
    const resp = await getOrderAppServicePackages({ pageNo: 1, pageSize: 999 });
    return resp.data.data.list || [];
  });

  useEffect(() => {
    console.log('IAP Connection status:', connected);
    if (packageList && packageList.length > 0 && connected) {
      const skus = packageList.map((item) => item.id);
      console.log('skus:', skus);
      const initializeStore = async () => {
        try {
          await fetchProducts({ skus, type: 'in-app' });
          await fetchProducts({ skus, type: 'subs' });
        } catch (error) {
          console.error('Failed to initialize store:', error);
        }
      };

      initializeStore();
    }
  }, [connected, fetchProducts, packageList]);

  const handleCompletePurchase = useCallback(
    async (purchase: Purchase) => {
      if (purchase && !isEmpty(currentIAPOrderData)) {
        try {
          if (Platform.OS === 'ios' && purchase.platform === 'ios' && 'currencyCodeIOS' in purchase) {
            const result = await validateReceipt({ sku: purchase.productId });
            if (result.isValid) {
              // Grant user the purchased content
              console.log('Receipt is valid');
              const checkResp = await postOrderAppInAppPurchaseCheckV2({
                receipt: purchase.purchaseToken!,
                payNo: currentIAPOrderData?.payNo!,
                transactionId: purchase.transactionId!,
                test: process.env.NODE_ENV !== 'production',
              });
              console.log('Platform: ios', JSON.stringify(checkResp.data, null, 2));
              sendAppsFlyerEvent(AFEventKey.AFPurchase, {
                af_currency: purchase.currencyCodeIOS || 'USD',
                af_revenue: checkResp.data.data.amount || '0',
                af_content_id: purchase?.id,
              });
            }
          }
          if (Platform.OS === 'android' && purchase.platform === 'android' && 'packageNameAndroid' in purchase) {
            const checkResp = await postOrderAppGoogleInAppPurchaseCheck({
              packageName: purchase.packageNameAndroid!,
              productId: purchase?.id,
              purchaseToken: purchase.purchaseToken!,
              payNo: currentIAPOrderData?.payNo!,
            });
            console.log('Platform: android', JSON.stringify(checkResp, null, 2));
            sendAppsFlyerEvent(AFEventKey.AFPurchase, {
              af_currency: products[0].currency || 'USD',
              af_revenue: products[0].price || '0',
              af_content_id: purchase?.id,
            });
          }
          // Finish the transaction 完成交易
          await finishTransaction({
            purchase: purchase,
            isConsumable: true, // Set true for consumable products
          });

          // Grant the purchase to user
          console.log('Purchase completed successfully!');

          onClose(true);
          setCheckId(undefined);
          await refreshAsync();
          try {
            await getAvailablePurchases();
            console.log('[PurchaseFlow] Available purchases refreshed');
          } catch (error) {
            console.warn('[PurchaseFlow] Failed to refresh available purchases:', error);
          }
        } catch (error) {
          console.error('Failed to complete purchase:', error);
        }
      }
    },
    [currentIAPOrderData, finishTransaction, getAvailablePurchases, onClose, products, refreshAsync, validateReceipt],
  );

  useEffect(() => {
    if (Platform.OS === 'android') {
      console.log('products:', products);
    }
  }, [products]);
  return (
    <Modal
      position="BOTTOM"
      maskBlur={false}
      visible={visible}
      onClose={() => {
        onClose(false);
        setCheckId(undefined);
      }}
      title={intl.formatMessage({ id: 'Payments.PayModal.title.planeType' })}
      onOk={async () => {
        if (!checkId) {
          Toast.error(intl.formatMessage({ id: 'Payments.PayModal.validate.plan' }));
          return;
        }
        const item = packageList.find((x) => x.id === checkId);

        try {
          const {
            data: { data: orderData },
          } = await postOrderAppPlaceOrder({
            packageId: checkId,
          });
          // 特定产品直接购买成功
          if (item?.price === 0) {
            const { data: orderPaymentResult } = await getOrderAppPaymentResult({
              orderNo: orderData.orderNo!,
            });
            sendAppsFlyerEvent(AFEventKey.AFPurchase, {
              af_currency: 'USD',
              af_revenue: '0',
              af_content_id: orderPaymentResult.data.id,
            });
            if (orderPaymentResult.code === -1) {
              Toast.error(orderPaymentResult.msg || intl.formatMessage({ id: 'failed' }));
            }
            onClose(true);
            setCheckId(undefined);
            setCurrentIAPOrderData(undefined);
            await refreshAsync();
          } else {
            const {
              data: { data: dataIAP },
            } =
              Platform.OS === 'ios'
                ? await postOrderAppInAppPurchase({ orderNo: orderData.orderNo! })
                : await postOrderAppGoogleInAppPurchase({ orderNo: orderData.orderNo! });

            if (!dataIAP.productId) {
              Toast.error(intl.formatMessage({ id: 'error' }));
              return;
            }
            console.log('dataIAP:', dataIAP);
            setCurrentIAPOrderData(dataIAP);
            // 开始购买
            const resp = await requestPurchase({
              request: {
                ios: {
                  sku: item?.id || '',
                  andDangerouslyFinishTransactionAutomatically: false,
                },
                android: {
                  skus: [item?.id || ''],
                },
              },
              type: 'in-app',
            });
            console.log('requestPurchase:', resp);
          }
        } catch (e: any) {
          // Handle different error types
          switch (e.code) {
            case 'E_USER_CANCELLED':
              // User cancelled - no error needed
              break;
            case 'E_NETWORK_ERROR':
              console.log('Network Error', 'Check your connection');
              break;
            default:
              console.log('Purchase Failed', e.message);
          }
          // Toast.error(intl.formatMessage({ id: 'error' }));
        }
      }}
      okButtonProps={{
        size: 'middle',
        disabled: !connected,
        textStyle: { lineHeight: pxToDp(42) },
        children: intl.formatMessage({ id: 'Payments.PayModal.Buy' }),
      }}>
      <View style={[styles.container]}>
        {packageList.map((item) => {
          const checked = item.id === checkId;
          const styles = checked ? itemStyleChecked : itemStyle;

          const price = ((item.price || 0) / 100)?.toFixed(2) || '0.0';
          const priceInteger = price.split('.')[0];
          const priceDecimal = price.split('.')[1];
          const disabled =
            item?.purchaseLimit &&
            item?.purchaseNum &&
            item.purchaseLimit > 0 &&
            item.purchaseNum >= item.purchaseLimit;
          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              disabled={!!disabled}
              style={[
                styles.container,
                {
                  backgroundColor: computedThemeColor.bg_primary,
                  borderColor: computedThemeColor.bg_primary,
                },
              ]}
              onPress={() => {
                setCheckId(item.id);
              }}>
              <CheckboxTwoTone
                width={pxToDp(44)}
                height={pxToDp(44)}
                color={disabled ? computedThemeColor.text_secondary : computedThemeColor.primary}
                twoToneColor="#000"
                checked={checked}
              />
              <View style={[styles.info]}>
                <Text
                  style={[
                    styles.name,
                    {
                      color: computedThemeColor.text,
                    },
                  ]}>
                  {item.packageName}
                </Text>
                <Text
                  style={[
                    styles.period,
                    {
                      color: computedThemeColor.text,
                    },
                  ]}>
                  {intl.formatMessage({ id: 'Payments.PayModal.ValidUntil' })}{' '}
                  {dayjs()
                    .add(item.subPeriod || 0, 'day')
                    .locale(intl.locale)
                    .format('YYYY MMM DD')}
                </Text>
              </View>
              <Text
                style={[
                  styles.amount,
                  {
                    color: computedThemeColor.text,
                  },
                ]}>
                $ {priceInteger}.
                <Text
                  style={[
                    styles.amountSub,
                    {
                      color: computedThemeColor.text,
                    },
                  ]}>
                  {priceDecimal}
                </Text>
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </Modal>
  );
}
