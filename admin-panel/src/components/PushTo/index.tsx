import { getUserManageGroup } from '@/services/api/userService';
import { useRequest } from 'ahooks';
import { Radio, RadioChangeEvent, Select, Space } from 'antd';
import { useEffect, useState } from 'react';

export default ({
  value,
  onChange,
  disabled,
  // formRef,
  forDisplay,
}: {
  value?: string; // value的值，就是onChange函数返回的值,也是表单初始化pushTo字段的值
  onChange?: (value?: string) => void; // onChange函数，如果没有传入，也会自己默认吗？
  disabled?: boolean;
  // formRef?: any;
  forDisplay?: boolean;
}) => {
  const [radioValue, setRadioValue] = useState<string>();
  const [selectValue, setSelectValue] = useState<string[]>([]);

  // radio 左侧
  const radioOnChange = (e: RadioChangeEvent) => {
    const tempValue = e.target.value;
    setRadioValue(tempValue);

    if (tempValue === 'all') {
      if (onChange) {
        onChange('all');
      }
    } else if (tempValue === 'group') {
      // if (onChange) {
      //   onChange('group'); // ok,pushTo表单验证通过
      // }
      // formRef.current?.setFieldValue('pushTo', '哈哈哈哈'); //这里onChange与setFieldValue效果是一样的

      if (onChange) {
        onChange(selectValue.join(',')); // 导致bug，有点坑，pushTo表单验证失败
      }
    }
  };

  // select 右侧
  const selectChange = (value: string[]) => {
    setSelectValue(value);
    if (onChange) {
      if (value && !!value.length) {
        onChange(value.join(','));
      } else {
        onChange();
      }
    }
  };

  //   获取group
  const { data: groupList } = useRequest(
    () => getUserManageGroup({ pageNo: 1, pageSize: 99999 }),
    { manual: false },
  );

  useEffect(() => {
    if (value) {
      if (value.includes('all')) {
        setRadioValue('all');
        setSelectValue([]);
      } else {
        setRadioValue('group');
        const v = value.split('::').pop();
        console.log({ v });

        setSelectValue(v?.split(',') || []);
      }
    }
  }, [value]);

  return (
    <>
      <Space direction="horizontal">
        <Radio.Group
          onChange={radioOnChange}
          value={radioValue}
          disabled={!!disabled}
        >
          <Radio value={'all'}>All users</Radio>
          <Radio value={'group'}>by group</Radio>
        </Radio.Group>
      </Space>

      <Space direction="vertical">
        {forDisplay ? (
          <div>
            {(groupList?.data?.list || [])
              .filter((x) => !!selectValue.find((y) => y === x.id))
              .map((z) => z.groupName)
              .join(',')}
          </div>
        ) : value === 'all' ? (
          <></>
        ) : (
          <Select
            mode="multiple"
            allowClear
            disabled={radioValue !== 'group' || !!disabled}
            style={{ width: 200 }}
            value={selectValue}
            onChange={selectChange}
            options={(groupList?.data?.list || []).map((item) => {
              return {
                value: item.id, // id是必须有效的字段
                label: item.groupName,
              };
            })}
          />
        )}
      </Space>
    </>
  );
};
