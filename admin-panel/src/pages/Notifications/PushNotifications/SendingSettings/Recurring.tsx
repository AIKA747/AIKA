import {
  Card,
  Checkbox,
  DatePicker,
  InputNumber,
  Radio,
  Select,
  Space,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
const { Title, Text } = Typography;

let utc = require('dayjs/plugin/utc');
// import utc from 'dayjs/plugin/utc' // ES 2015
dayjs.extend(utc);

// const localTime = dayjs("2020-05-03 22:15:01"); // 指定的本地时间
const localTime = dayjs(); // 指定的本地时间
const utcTime = localTime.utc().format();
console.log({ utcTime });

const WeekOptions = [
  {
    value: 1,
    label: 'Monday',
  },
  {
    value: 2,
    label: 'Tuesday',
  },
  {
    value: 3,
    label: 'Wednesday',
  },
  {
    value: 4,
    label: 'Thursday',
  },
  {
    value: 5,
    label: 'Friday',
  },
  {
    value: 6,
    label: 'Saturday',
  },
  {
    value: 7,
    label: 'Sunday',
  },
];

const YearOptions = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
].map((ele, index) => ({
  value: index + 1,
  label: ele,
}));

const DateOptions = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30, 31,
].map((ele) => ({
  value: ele,
  label: ele,
}));

const HourOptions = [
  // 0, 1, 2, 3, 4,
  5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
].map((ele) => ({
  value: ele,
  label: ele,
}));

export default (props: any) => {
  const { onChange, formRef } = props;

  const [recurringType, setRecurringType] = useState<string>();
  const [dailyRecurrence, setDailyRecurrence] = useState<string>();

  const [InputValues, setValues] = useState({
    IntervalDays: null,
    DailyHour: null,
    WeeklyDay: null,
    WeeklyHour: null,
    MonthlyDate: null,
    MonthlyHour: null,
    YearlyMonth: null,
    YearlyDate: null,
    YearlyHour: null,
  });

  useEffect(() => {
    const {
      IntervalDays,
      DailyHour,
      WeeklyDay,
      WeeklyHour,
      MonthlyDate,
      MonthlyHour,
      YearlyMonth,
      YearlyDate,
      YearlyHour,
    } = InputValues;
    if (recurringType === 'IntervalFrequency') {
      if (IntervalDays) {
        onChange?.('scheduledRecurring');
        // formRef.current.setFieldValue('cron', [
        //   '0',
        //   '0',
        //   'submitTime', // 用于提交时处理： 获取时间点（小时向后取整）
        //   `${IntervalDays}`,
        //   '',
        //   '?',
        //   '*',
        // ]);
        const utcTime = dayjs.utc(); // 获取当前UTC时间
        // const localTime = utcTime.local().format(); // 转换为本地时间
        const ut5Time = dayjs().utcOffset('+05:00'); // 转换为哈萨克斯坦 东5区时间
        // console.log(`UTC时间: ${utcTime}`);
        // // console.log(`本地时间: ${localTime}`);
        // console.log(`东五区时间: ${ut5Time}`);

        const utcTimeHour = utcTime.hour();
        const ut5TimeHour = ut5Time.hour();
        // console.log(`UTC时间--小时: ${utcTimeHour}`);
        // // console.log(`本地时间: ${localTime}`);
        // console.log(`东五区时间--小时: ${ut5TimeHour}`);

        formRef.current.setFieldValue('cron', [
          '0',
          '0',
          `${utcTimeHour + 1}`, // 获取时间点（小时向后取整），后面需要改造为 【提交时处理】
          `1/${IntervalDays + 1}`, // 每隔1天，就是每2天
          '',
          '?',
          '*',
        ]);

        formRef.current.setFieldValue(
          // 需要改为提交时获取时间点（小时向后取整）
          'remark',
          `Push notifictions every ${IntervalDays} days at ${
            ut5TimeHour + 1
          } o'clock.`,
        );
      } else {
        onChange?.();
      }
    }

    if (recurringType === 'DailyRecurrence') {
      if (dailyRecurrence === 'daily') {
        if (DailyHour) {
          onChange?.('scheduledRecurring');
          formRef.current.setFieldValue('cron', [
            '0',
            '0',
            `${DailyHour - 5}`,
            '',
            '',
            '?',
            '*',
          ]);
          formRef.current.setFieldValue(
            'remark',
            `Daily push notifictions at ${DailyHour} o'clock. `,
          );
        } else {
          onChange?.();
        }
      }
      if (dailyRecurrence === 'weekly') {
        if (WeeklyDay && WeeklyHour) {
          onChange?.('scheduledRecurring');
          formRef.current.setFieldValue('cron', [
            '0',
            '0',
            `${WeeklyHour - 5}`,
            '?',
            '',
            WeeklyDay,
            // '?',
          ]);
          const weekDay = WeekOptions.filter(
            (ele) => ele.value === WeeklyDay,
          )[0].label;
          formRef.current.setFieldValue(
            'remark',
            `Weekly push notifictions on ${weekDay} at ${WeeklyHour} o'clock. `,
          );
        } else {
          onChange?.();
        }
      }
      if (dailyRecurrence === 'monthly') {
        if (MonthlyDate && MonthlyHour) {
          onChange?.('scheduledRecurring');
          formRef.current.setFieldValue('cron', [
            '0',
            '0',
            `${MonthlyHour - 5}`,
            MonthlyDate,
            '',
            '?',
            '*',
          ]);
          formRef.current.setFieldValue(
            'remark',
            `Monthly push notifictions on ${MonthlyDate} at ${MonthlyHour} o'clock. `,
          );
        } else {
          onChange?.();
        }
      }
      if (dailyRecurrence === 'yearly') {
        if (YearlyMonth && YearlyDate && YearlyHour) {
          onChange?.('scheduledRecurring');
          formRef.current.setFieldValue('cron', [
            '0',
            '0',
            `${YearlyHour - 5}`,
            YearlyDate,
            YearlyMonth,
            '?',
            '*',
          ]);
          const Month = YearOptions.filter(
            (ele) => ele.value === YearlyMonth,
          )[0].label;
          formRef.current.setFieldValue(
            'remark',
            `Yearly push notifictions on the ${Month}/${YearlyDate} at ${YearlyHour} o'clock. `,
          );
        } else {
          onChange?.();
        }
      }
    }
  }, [InputValues, recurringType, dailyRecurrence, formRef, onChange]);

  return (
    <Card style={{ width: '100%', marginTop: 15 }}>
      <Space direction="vertical" size={30}>
        <Space direction="vertical" size={10}>
          <Checkbox
            checked={recurringType === 'IntervalFrequency'}
            onChange={() => {
              setRecurringType('IntervalFrequency');
              setDailyRecurrence(null);
              setValues({
                IntervalDays: 1,
                DailyHour: null,
                WeeklyDay: null,
                WeeklyHour: null,
                MonthlyDate: null,
                MonthlyHour: null,
                YearlyMonth: null,
                YearlyDate: null,
                YearlyHour: null,
              });
            }}
          >
            <Title level={5} style={{ marginBottom: 0, gap: 0 }}>
              Interval frequency
            </Title>
          </Checkbox>
          <Text style={{ paddingLeft: 20 }}>
            Start pushing now, and then push every
            <InputNumber
              style={{ width: 120, margin: '0 10px' }}
              min={1}
              max={30}
              disabled={recurringType !== 'IntervalFrequency'}
              value={InputValues.IntervalDays}
              placeholder="input number"
              onChange={(value) => {
                console.log(value);
                // const value =
                setValues((v) => ({ ...v, IntervalDays: value }));
                // if (value) {
                //   onChange?.('scheduledRecurring')
                //   formRef.current.setFieldValue('cron', ["*", "*", "*", value, "*", "*", "*"])
                // } else {
                //   onChange?.()
                // }
              }}
            />
            days thereafter.
          </Text>
        </Space>

        <Space direction="vertical" size={10}>
          <Checkbox
            checked={recurringType === 'DailyRecurrence'}
            onChange={() => {
              setRecurringType('DailyRecurrence');
              setValues({
                IntervalDays: null,
                DailyHour: null,
                WeeklyDay: null,
                WeeklyHour: null,
                MonthlyDate: null,
                MonthlyHour: null,
                YearlyMonth: null,
                YearlyDate: null,
                YearlyHour: null,
              });
            }}
          >
            <Title level={5} style={{ marginBottom: 0, gap: 0 }}>
              Daily recurrence
            </Title>
          </Checkbox>
          <Radio.Group
            style={{ paddingLeft: 20 }}
            onChange={(e) => {
              setValues({
                IntervalDays: null,
                DailyHour: null,
                WeeklyDay: null,
                WeeklyHour: null,
                MonthlyDate: null,
                MonthlyHour: null,
                YearlyMonth: null,
                YearlyDate: null,
                YearlyHour: null,
              });
              // if (recurringType === 'DailyRecurrence') {
              //   setDailyRecurrence(e.target.value);
              // }
              setRecurringType('DailyRecurrence');
              setDailyRecurrence(e.target.value);
            }}
            value={dailyRecurrence}
          >
            <Space direction="vertical">
              <Space direction="horizontal">
                <Radio value={'daily'}>Daily: Push notifications at </Radio>
                <Select
                  style={{ width: 160 }}
                  placeholder="select hour"
                  value={InputValues.DailyHour}
                  allowClear
                  // mode="multiple"
                  disabled={
                    recurringType !== 'DailyRecurrence' ||
                    dailyRecurrence !== 'daily'
                  }
                  onChange={(value) => {
                    setValues((v) => ({ ...v, DailyHour: value }));
                  }}
                  options={HourOptions}
                />
                <Text>every day</Text>
              </Space>

              <Space direction="horizontal">
                <Radio value={'weekly'}>Weekly: Push notifications on</Radio>
                <Select
                  style={{ width: 200 }}
                  allowClear
                  // mode="multiple"
                  value={InputValues.WeeklyDay}
                  placeholder="select day of the week"
                  disabled={
                    recurringType !== 'DailyRecurrence' ||
                    dailyRecurrence !== 'weekly'
                  }
                  onChange={(value) => {
                    setValues((v) => ({ ...v, WeeklyDay: value }));
                  }}
                  options={WeekOptions}
                />
                <Text>at</Text>
                <Select
                  style={{ width: 160 }}
                  value={InputValues.WeeklyHour}
                  // mode="multiple"
                  allowClear
                  disabled={
                    recurringType !== 'DailyRecurrence' ||
                    dailyRecurrence !== 'weekly'
                  }
                  onChange={(value) => {
                    setValues((v) => ({ ...v, WeeklyHour: value }));
                  }}
                  placeholder="select hour"
                  options={HourOptions}
                />
              </Space>
              <Space direction="horizontal">
                <Radio value={'monthly'}>
                  Monthly: Push notifications on the
                </Radio>
                <Select
                  style={{ width: 160 }}
                  // mode="multiple"
                  allowClear
                  value={InputValues.MonthlyDate}
                  disabled={
                    recurringType !== 'DailyRecurrence' ||
                    dailyRecurrence !== 'monthly'
                  }
                  onChange={(value) => {
                    setValues((v) => ({ ...v, MonthlyDate: value }));
                  }}
                  placeholder="select day"
                  options={DateOptions}
                />
                <Text>at</Text>
                <Select
                  style={{ width: 160 }}
                  // mode="multiple"
                  value={InputValues.MonthlyHour}
                  allowClear
                  disabled={
                    recurringType !== 'DailyRecurrence' ||
                    dailyRecurrence !== 'monthly'
                  }
                  onChange={(value) => {
                    setValues((v) => ({ ...v, MonthlyHour: value }));
                  }}
                  placeholder="select hour"
                  options={HourOptions}
                />
              </Space>

              <Space direction="horizontal">
                <Radio value={'yearly'}>
                  Yearly: Push notifications on the
                </Radio>
                {/* <DatePicker
                  showTime={{ format: 'HH' }}
                  format={'MM-DD HH'}
                  onChange={(v) => {
                    console.log(v);
                    if (!v) {
                      onChange?.();
                    }
                  }}
                  onOk={(v) => {
                    // console.log(dayjs(v).format('YYYY-MM-DD HH'));
                    // console.log(
                    //   dayjs(v).format('YYYY-MM-DD HH:mm:ss'),
                    // );
                    onChange?.('scheduledSingle');
                    formRef.current.setFieldValue(
                      'pushTime',
                      dayjs(v).format('YYYY-MM-DD HH:mm:ss'),
                    );
                  }}
                /> */}
                <Select
                  style={{ width: 160 }}
                  // mode="multiple"
                  allowClear
                  value={InputValues.YearlyMonth}
                  disabled={
                    recurringType !== 'DailyRecurrence' ||
                    dailyRecurrence !== 'yearly'
                  }
                  onChange={(value) => {
                    setValues((v) => ({ ...v, YearlyMonth: value }));
                  }}
                  placeholder="select month"
                  options={YearOptions}
                />
                <Select
                  style={{ width: 160 }}
                  // mode="multiple"
                  allowClear
                  value={InputValues.YearlyDate}
                  disabled={
                    recurringType !== 'DailyRecurrence' ||
                    dailyRecurrence !== 'yearly'
                  }
                  onChange={(value) => {
                    setValues((v) => ({ ...v, YearlyDate: value }));
                  }}
                  placeholder="select day"
                  options={DateOptions}
                />
                <Text>at</Text>
                <Select
                  style={{ width: 160 }}
                  // mode="multiple"
                  allowClear
                  disabled={
                    recurringType !== 'DailyRecurrence' ||
                    dailyRecurrence !== 'yearly'
                  }
                  onChange={(value) => {
                    setValues((v) => ({ ...v, YearlyHour: value }));
                  }}
                  placeholder="select hour"
                  value={InputValues.YearlyHour}
                  options={HourOptions}
                />
              </Space>
            </Space>
          </Radio.Group>
        </Space>

        <div>
          <Title level={5}>Stop the push notifications（Optional）</Title>
          <Text>
            The system defaults to continuous recurring cycles. If you need the
            task to automatically stop at a certain time, please select:
          </Text>
          <DatePicker
            style={{ marginLeft: 10 }}
            format={'YYYY-MM-DD'}
            onChange={(v) => {
              console.log(v);
              if (!v) {
                formRef.current.setFieldValue('stopTime', '');
              } else {
                // const time = dayjs(v).utc().format('YYYY-MM-DD HH:mm:ss');
                const time = dayjs(v)
                  //.add(12, 'hour') // 日期组件，以
                  .subtract(5, 'hour')
                  .format('YYYY-MM-DD HH:mm:ss'); // 默认就是哈萨克斯坦时间，减去5换算成utc

                formRef.current.setFieldValue(
                  'stopTime',
                  time, // 传utc时间
                );
              }
            }}
            onOk={() => {}}
          />
        </div>
      </Space>
    </Card>
  );
};
