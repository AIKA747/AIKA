import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { ArrowDownOutline } from '@/components/Icon';
import { useConfigProvider } from '@/hooks/useConfig';
import pxToDp from '@/utils/pxToDp';

import styles from './styles';
import { CollapseProps } from './types';

export default function Collapse(props: CollapseProps) {
  const { computedThemeColor } = useConfigProvider();

  const { title, children, isOpen = true, onChangeOpen } = props;
  const [innerIsOpen, setInnerIsOpen] = useState(isOpen);
  useEffect(() => {
    setInnerIsOpen(isOpen);
  }, [isOpen]);

  return (
    <View
      style={[
        styles.container,
        {
          // borderColor: '#EBEBEB',
        },
      ]}>
      <TouchableOpacity
        style={[
          styles.head,
          {
            // borderBottomWidth: isOpen ? pxToDp(2) : 0,
          },
        ]}
        onPress={() => {
          setInnerIsOpen(!innerIsOpen);
          onChangeOpen?.(!innerIsOpen);
        }}>
        <Text style={styles.headTitle}>{title}</Text>
        <View
          style={[
            styles.headIcon,
            {
              transform: [
                {
                  rotate: isOpen ? '0deg' : '-90deg',
                },
              ],
            },
          ]}>
          <ArrowDownOutline color={computedThemeColor.bg_primary} width={pxToDp(44)} height={pxToDp(44)} />
        </View>
      </TouchableOpacity>
      {innerIsOpen && <View style={styles.content}>{children}</View>}
    </View>
  );
}
