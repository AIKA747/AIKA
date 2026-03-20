import { useRequest } from 'ahooks';
import { uniqBy } from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { TextInput, TouchableOpacity, View } from 'react-native';

import CheckboxGroup from '@/components/CheckboxGroup';
import { PlushOutline } from '@/components/Icon';
import Toast from '@/components/Toast';
import { Theme, useConfigProvider } from '@/hooks/useConfig';
import { getUserAppTags } from '@/services/userService';
import pxToDp from '@/utils/pxToDp';

import styles from './styles';
import { ChoseTagsProps } from './types';

export default function ChoseTags({ value, onChange, style, page }: ChoseTagsProps) {
  const intl = useIntl();
  const { computedThemeColor, computedTheme } = useConfigProvider();

  const { data: tags } = useRequest(async () => {
    return (await getUserAppTags({ pageNo: 1, pageSize: 9999 })).data.data.list || [];
  });

  const [otherTag, setOtherTag] = useState<string>('');

  // 组合 options,用户有可能自定义
  const options = useMemo(() => {
    const list = [...(tags || []), ...(value || [])].map((item) => {
      return { label: item, key: item };
    });

    return uniqBy(list, 'key');
  }, [tags, value]);

  const handleAddValue = useCallback(() => {
    if (!otherTag) {
      Toast.info(intl.formatMessage({ id: 'Profile.InterestsTags.ChoseTags.validate.empty' }));
      return;
    }
    // 不能前后空格
    if (otherTag.startsWith(' ') || otherTag.endsWith(' ')) {
      Toast.info(intl.formatMessage({ id: 'Profile.InterestsTags.ChoseTags.validate.empty.spaces' }));
      return;
    }

    if (options.some((x) => x.key === otherTag)) {
      Toast.info(intl.formatMessage({ id: 'Profile.InterestsTags.ChoseTags.validate.exist' }));
      return;
    }

    if (page === 'sign') {
    }

    if (page === 'profile') {
    }

    onChange?.([...(value || []), otherTag]);
    setOtherTag('');
  }, [intl, onChange, options, otherTag, page, value]);

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.addMore,
          {
            backgroundColor: computedThemeColor.bg_secondary,
          },
        ]}>
        <TextInput
          style={[
            styles.input,
            {
              // backgroundColor: computedThemeColor.bgOpacity,
              // borderColor: computedThemeColor.bgOpacity,
              color: computedThemeColor.text,
            },
          ]}
          value={otherTag}
          placeholder={intl.formatMessage({ id: 'Profile.InterestsTags.ChoseTags.placeholder' })}
          onChange={(e) => {
            setOtherTag(e.nativeEvent.text);
          }}
          placeholderTextColor={computedTheme === Theme.LIGHT ? '#aaa' : 'rgba(255,255,255,0.4)'}
          onSubmitEditing={handleAddValue}
        />
        <TouchableOpacity style={[styles.iconWrapper]} onPress={handleAddValue}>
          <View
            style={[
              styles.iconBg,
              {
                backgroundColor: computedThemeColor.primary,
              },
            ]}>
            <PlushOutline style={[styles.icon]} width={pxToDp(32)} height={pxToDp(32)} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>
      <CheckboxGroup
        style={[styles.CheckboxGroup]}
        itemStyle={[styles.CheckboxGroupItem]}
        mode="block"
        value={value}
        multi
        onChange={(v) => {
          onChange?.(v);
        }}
        options={options}
      />
    </View>
  );
}
