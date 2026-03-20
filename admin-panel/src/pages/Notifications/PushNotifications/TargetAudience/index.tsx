import { getUserManageGroup } from '@/services/api/userService';
import EM from '@/utils/EM';
import { useRequest } from 'ahooks';
import { Col, Radio, Row, Select, Tabs, Typography } from 'antd';
import { useEffect, useState } from 'react';

import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone'; // ES 2015
import utc from 'dayjs/plugin/utc'; // ES 2015
// const timezone = require('@dayjs/plugin-timezone');
dayjs.extend(utc);
dayjs.extend(timezone);
const { Text } = Typography;

export default ({
  value,
  onChange,
  disabled,
  formRef,
}: // forDisplay,
{
  value?: string; // value的值，就是onChange函数返回的值,也是表单初始化pushTo字段的值
  onChange?: (value?: string) => void; // onChange函数，如果没有传入，也会自己默认吗？
  disabled?: boolean;
  formRef?: any;
  // forDisplay?: boolean;
}) => {
  // console.log(value);

  const [tab, setTab] = useState<string>();
  const [radioValue, setRadioValue] = useState<string>();

  const [selectPushTo, setPushTo] = useState<string[]>([]);
  const [inactiveDays, setInactiveDays] = useState<number>();

  const [utcTimeHour, setUtcTimeHour] = useState<number>();

  EM.addListener('category', () => {});
  useEffect(() => {
    return () => {
      EM.removeListener('category', () => {});
    };
  }, []);

  //   获取group
  const { data: groupList } = useRequest(
    () => getUserManageGroup({ pageNo: 1, pageSize: 99999 }),
    { manual: false },
  );

  useEffect(() => {
    if (value) {
      const inactiveDays = formRef.current.getFieldValue('inactiveDays');
      if (value === 'all') {
        // setPushTo('all');
      } else {
        setPushTo(value.split(','));
        if (inactiveDays) {
          setRadioValue('inactive');
        } else {
          setRadioValue('group');
        }
      }
    }
  }, [value, formRef]);

  return (
    <>
      <Tabs
        activeKey={tab}
        onChange={(activeKey) => {
          setTab(activeKey);
          if (activeKey === 'all') {
            // All users
            onChange?.('all');
            EM.emit('category', 'active');
            // formRef.current.setFieldValue('category', null);
          } else {
            // Specific users
            onChange?.(); // 切换到Specific users后做表单验证
          }
        }}
        // centered
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
              <Radio.Group
                onChange={(e) => {
                  const tempValue = e.target.value;
                  setRadioValue(tempValue);
                  if (tempValue === 'group') {
                    onChange?.(undefined);
                    setPushTo([]);
                    setInactiveDays(undefined);
                    EM.emit('category', 'active');
                  } else if (tempValue === 'inactive') {
                    // onChange?.('all');
                    onChange?.(undefined);
                    EM.emit('category', 'inactive');
                    setPushTo([]);
                    setInactiveDays(undefined);
                  }
                }}
                value={radioValue}
                disabled={!!disabled}
                style={{ width: '100%' }}
              >
                <Row>
                  <Col span={12}>
                    <Radio value={'group'}>by group</Radio>
                    <Select
                      mode="multiple"
                      allowClear
                      disabled={radioValue !== 'group' || !!disabled}
                      style={{ width: 200 }}
                      value={selectPushTo}
                      onChange={(values) => {
                        console.log(values);
                        setPushTo(values);
                        onChange?.(values.join(','));
                        formRef.current.setFieldValue(
                          'inactiveDays',
                          undefined,
                        );
                      }}
                      options={(groupList?.data?.list || []).map((item) => {
                        return {
                          value: item.id, // id是必须有效的字段
                          label: item.groupName,
                        };
                      })}
                    />
                  </Col>
                  <Col span={12} style={{ display: 'none' }}>
                    <Radio value={'inactive'}>Inactive</Radio>
                    <Select
                      // mode="multiple"
                      allowClear
                      disabled={radioValue !== 'inactive' || !!disabled}
                      style={{ width: 320 }}
                      value={inactiveDays}
                      onChange={(v) => {
                        console.log(v);
                        setInactiveDays(v);
                        formRef.current.setFieldValue('inactiveDays', v);
                        if (!v) {
                          onChange?.();
                        } else {
                          formRef.current.setFieldValue(
                            'category',
                            'eventTriggerInactive',
                          );
                          onChange?.('all');
                          const utcTime = dayjs.utc();
                          const utcTimeHour = utcTime.hour() + 1; // 向后取证
                          formRef.current.setFieldValue('cron', [
                            '0',
                            '0',
                            utcTimeHour,
                            '*',
                            '*',
                            '?',
                            '*',
                          ]);
                          setUtcTimeHour(utcTimeHour);
                        }
                      }}
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
                  </Col>
                </Row>
                <Row>
                  <Col span={12}></Col>
                  <Col span={12}>
                    <div>
                      {formRef.current?.getFieldValue('inactiveDays') && (
                        <Text type="danger">{`Notifications will be pushed at ${
                          utcTimeHour + 5
                        } o'clock on daily basis to the users who did not open the app for exact ${inactiveDays} days.`}</Text>
                      )}
                    </div>
                  </Col>
                </Row>
              </Radio.Group>
            ),
          },
        ]}
      />
    </>
  );
};
