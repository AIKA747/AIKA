import { getUserManageGroup } from '@/services/api/userService';
import { useRequest } from 'ahooks';
import { Radio, RadioChangeEvent, Select, Space, Tabs } from 'antd';
import { useEffect, useState } from 'react';

export default ({
  value,
  onChange,
  disabled,
}: // formRef,
// forDisplay,
{
  value?: string; // value的值，就是onChange函数返回的值,也是表单初始化pushTo字段的值
  onChange?: (value?: string) => void; // onChange函数，如果没有传入，也会自己默认吗？
  disabled?: boolean;
  // formRef?: any;
  // forDisplay?: boolean;
}) => {
  console.log(value);

  const [tab, setTab] = useState<string>();
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
      if (value === 'all') {
        setRadioValue('all');
        setSelectValue([]);
      } else {
        setRadioValue('group');
        setSelectValue(value.split(','));
      }
    }
  }, [value]);

  return (
    <>
      <Tabs
        activeKey={tab}
        centered
        items={[
          {
            label: `All users`,
            key: 'all',
            children: ``,
          },
          {
            label: `Specific users`,
            key: 'group',
            children: (
              <>
                <Radio.Group
                  onChange={radioOnChange}
                  value={radioValue}
                  disabled={!!disabled}
                >
                  <Space direction="horizontal" size={30}>
                    <>
                      <Radio value={'group'}>by group</Radio>
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
                    </>

                    <>
                      <Radio value={'inactive'}>Inactive</Radio>
                      <Select
                        mode="multiple"
                        allowClear
                        disabled={radioValue !== 'inactive' || !!disabled}
                        style={{ width: 200 }}
                        value={selectValue}
                        onChange={selectChange}
                        options={[
                          {
                            value: 3,
                            label: 'Not opened the app in the last 3 days',
                          },
                          {
                            value: 7,
                            label: 'Not opened the app in the last 7 days',
                          },
                          {
                            value: 30,
                            label: 'Not opened the app in the last 30 days',
                          },
                        ]}
                      />
                    </>
                  </Space>
                </Radio.Group>

                {/* <Space direction="vertical">
                {value === 'all' ? (
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
              </Space> */}
              </>
            ),
          },
        ]}
        onChange={(activeKey) => {
          setTab(activeKey);
        }}
      />
    </>
  );
};
