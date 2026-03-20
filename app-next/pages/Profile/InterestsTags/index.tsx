import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { View, Text, TouchableWithoutFeedback, Keyboard } from 'react-native';

import Button from '@/components/Button';
import Modal from '@/components/Modal';
import Toast from '@/components/Toast';
import { useAuth } from '@/hooks/useAuth';
import { useConfigProvider } from '@/hooks/useConfig';
import { patchUserAppInfo } from '@/services/userService';
import getLocales from '@/utils/getLocales';

import ChoseTags from './ChoseTags';
import styles, { modalStyles } from './styles';

export default function InterestsTags() {
  const intl = useIntl();
  const { computedThemeColor } = useConfigProvider();

  const { userInfo, signIn } = useAuth();
  const [visible, setVisible] = useState(false);

  const [value, setValue] = useState<string[]>([]);

  useEffect(() => {
    if (!visible) {
      setValue([]);
    } else {
      setValue([...(userInfo?.tags || [])]);
    }
  }, [userInfo?.tags, visible]);

  const handleSave = useCallback(async () => {
    if (value.length < 3) {
      Toast.error(intl.formatMessage({ id: 'Profile.InterestsTags.validate.less' }));
      return;
    }

    const locales = getLocales();
    const countryCode = locales?.countryCode || 'US';

    const resp = await patchUserAppInfo({
      tags: value,
      country: countryCode,
    });
    if (resp.data.code === 0) {
      setVisible(false);
      await signIn(resp.data.data.token!);
    }
  }, [intl, signIn, value]);

  return (
    <>
      <View style={[styles.container]}>
        <View style={[styles.title]}>
          <Text
            style={[
              styles.titleText,
              {
                color: computedThemeColor.text,
              },
            ]}>
            {intl.formatMessage({ id: 'Profile.InterestsTags.title' })}
          </Text>
          <Button
            style={[styles.titleButton]}
            size="small"
            type="ghost"
            onPress={() => {
              setVisible(true);
            }}>
            {intl.formatMessage({ id: 'Edit' })}
          </Button>
        </View>

        {userInfo?.tags?.length && (
          <View style={[styles.items]}>
            {userInfo?.tags?.map((item, index) => {
              // const randomColor = colors[index % colors.length];
              return (
                <View
                  key={index}
                  style={[
                    styles.item,
                    {
                      backgroundColor: computedThemeColor.primary,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.itemText,
                      {
                        color: '#FFF',
                      },
                    ]}>
                    {item}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
      </View>

      <Modal
        position="BOTTOM"
        visible={visible}
        okButtonProps={{
          children: intl.formatMessage({ id: 'Save' }),
          size: 'middle',
          style: {},
        }}
        title={intl.formatMessage({ id: 'Profile.InterestsTags.title' })}
        onOk={handleSave}
        onClose={() => {
          setVisible(false);
        }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[modalStyles.container]}>
            <ChoseTags value={value} onChange={setValue} page="profile" />
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}
