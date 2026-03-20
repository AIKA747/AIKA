import EM from '@/utils/EM';
import { Card, DatePicker, Radio, Space, Tabs, Typography } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import Recurring from './Recurring';
const { Text } = Typography;

import timezone from 'dayjs/plugin/timezone'; // ES 2015
import utc from 'dayjs/plugin/utc'; // ES 2015
// import moment from 'moment';
// const timezone = require('@dayjs/plugin-timezone');
dayjs.extend(utc);
dayjs.extend(timezone);

export default ({
  value,
  onChange,
  formRef,
}: {
  value?: string; // value的值，就是onChange函数返回的值,也是表单初始化pushTo字段的值
  onChange?: (value?: string) => void; // onChange函数，如果没有传入，也会自己默认吗？
  // disabled?: boolean;
  formRef?: any;
  // forDisplay?: boolean;
}) => {
  // console.log(value);

  // const minDate = moment().subtract(1, 'month').startOf('month');
  // const minDate = dayjs()
  // const disabledDate = (current) => {
  //   console.log({ minDate });
  //   console.log(minDate.format('YYYY-MM-DD hh:mm:ss'));
  //   // 注意：这里的current是moment对象
  //   return current < minDate;
  // };

  const [tab, setTab] = useState<string>('instant');
  // const [OneTime, setOneTime] = useState<any>();
  const [radioValue, setRadioValue] = useState<string>();

  useEffect(() => {
    if (value) {
      setTab(value);
      if (value === 'instant') {
      } else if (value.includes('scheduled')) {
        setTab('scheduled');
      } else if (value === 'eventTriggerInactive') {
      }
    }
  }, [value]);

  EM.addListener('category', (v) => {
    console.log(v);
    setRadioValue(v);
    onChange?.('instant'); // Target audience 变化，category就重置为instant
  });
  useEffect(() => {
    return () => {
      EM.removeListener('category', () => {});
    };
  }, []);

  return (
    <Tabs
      className="wk-tabs"
      activeKey={tab}
      onChange={(activeKey) => {
        setTab(activeKey);
        // EM.emit('category', activeKey); // 不需要
        if (activeKey === 'instant') {
          // 后端一旦判断instant,cron和pushAt都不会看，直接推送 （传cron和pushAt只为验证）
          onChange?.('instant');
        } else if (activeKey === 'scheduled') {
          // onChange?.('scheduledSingle');
          onChange?.();
          setRadioValue('scheduledSingle');
        }
      }}
      // centered
      items={
        radioValue === 'inactive'
          ? []
          : [
              {
                label: `Instant sending`,
                key: 'instant',
                children: (
                  <Text>
                    {' '}
                    After successfully creating this push content, the task will
                    start running soon.
                  </Text>
                ),
              },
              {
                label: `Scheduled sending`,
                key: 'scheduled',
                children: (
                  <div style={{ width: '100%' }}>
                    <Radio.Group
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === 'scheduledSingle') {
                          setRadioValue('scheduledSingle');
                          // onChange?.('scheduledSingle');
                          onChange?.();
                        } else if (value === 'scheduledRecurring') {
                          setRadioValue('scheduledRecurring');
                          onChange?.();
                        }
                      }}
                      value={radioValue}
                      // disabled={!!disabled}
                    >
                      <Space direction="horizontal" size={30}>
                        <Radio value={'scheduledSingle'}>One-time</Radio>
                        <Radio value={'scheduledRecurring'}>
                          Recurring options
                        </Radio>
                      </Space>
                    </Radio.Group>
                    {radioValue === 'scheduledSingle' && (
                      <Card style={{ width: '100%', marginTop: 15 }}>
                        <Space
                          direction="vertical"
                          size={10}
                          style={{ padding: 0 }}
                        >
                          <Space direction="horizontal" size={30}>
                            <Text>Select time</Text>
                            <DatePicker
                              // minDate={dayjs()}
                              format={'YYYY-MM-DD HH'}
                              // value={OneTime}
                              showTime={{ format: 'HH' }}
                              showNow={false}
                              //  disabledDate={disabledDate}
                              onChange={(v) => {
                                if (!v) {
                                  onChange?.();
                                }
                              }}
                              onOk={(v) => {
                                console.log(v);
                                // const now = dayjs();
                                // if (v.isBefore(now)) {
                                //   const currentTime = dayjs();
                                //   // 延后一小时
                                //   const delayedTime = currentTime.add(1, 'hour');
                                //   setOneTime(delayedTime)
                                // } else {
                                //   setOneTime(v)
                                // }
                                if (!v) {
                                  onChange?.();
                                } else {
                                  // console.log(dayjs(v).format('YYYY-MM-DD HH'));
                                  // console.log(
                                  //   dayjs(v).format('YYYY-MM-DD HH:mm:ss'),
                                  // );

                                  // 东5区操作（UTC+5），获取utc时间
                                  // const time = dayjs(v)
                                  //   .subtract(5, 'hour')
                                  //   .format('YYYY-MM-DD HH:mm:ss');

                                  // 设置特定时区
                                  // const timezone = 'America/New_York'; // 例如纽约时区
                                  // const timezone = 'Europe/Kaliningrad'; //
                                  // const Time = dayjs(v).tz(timezone); //

                                  const time = dayjs(v)
                                    .subtract(5, 'hour') // 默认就是哈萨克斯坦时间，减去5换算成utc
                                    // .utc()
                                    .format('YYYY-MM-DD HH:mm:ss');

                                  onChange?.('scheduledSingle');
                                  formRef.current.setFieldValue(
                                    'pushTime',
                                    time,
                                  ); // 传给后端用utc时间

                                  // 获取东5区（UTC+5）的当前时间
                                  const datetimeInUTC5 = dayjs(v)
                                    // .utcOffset('+05:00')  // 默认就是哈萨克斯坦时间
                                    .format('YYYY-MM-DD HH:mm:ss');

                                  // console.log(datetimeInUTC5);
                                  formRef.current.setFieldValue(
                                    'remark',
                                    `One time push notifictions at ${datetimeInUTC5}`,
                                  ); // 展示用东五区时间
                                }
                              }}
                            />
                            {/* <TimePicker showTime={{ format: 'HH' }} onChange={()=>{}} defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')} /> */}
                          </Space>
                          <div>
                            <span>* </span>
                            {`Note that the system will use the user's local time zone as a reference. If the user's location may already be past the time you want to set, please choose another day or use the "Daily recurrence" option.`}
                          </div>
                        </Space>
                      </Card>
                    )}
                    {radioValue === 'scheduledRecurring' && (
                      <Recurring
                        value={value}
                        onChange={onChange}
                        formRef={formRef}
                      />
                    )}
                  </div>
                ),
              },
            ]
      }
    />
  );
};
