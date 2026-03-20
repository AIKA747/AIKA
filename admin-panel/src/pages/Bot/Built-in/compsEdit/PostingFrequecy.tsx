import { Radio, Select, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
const { Text } = Typography;
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

const isNumeric = function (value: any): boolean {
  // 检查是否是数字
  if (typeof value === 'number') {
    return true;
  }
  // 检查是否是字符串且可以转换为数字
  if (typeof value === 'string') {
    // 使用 parseFloat 转换，并检查是否为 NaN
    return !isNaN(parseFloat(value)) && isFinite(Number(value));
  }
  return false;
};
// console.log(isNumeric(123)); // true
// console.log(isNumeric('123')); // true
// console.log(isNumeric('123.45')); // true
// console.log(isNumeric('abc')); // false
// console.log(isNumeric('')); // false
// console.log(isNumeric(null)); // false
// console.log(isNumeric(undefined)); // false

const PostingFrequecy = (props: any) => {
  const { value, onChange, formRef } = props;

  const [frequencyType, setFrequencyType] = useState<string>();
  const [InputValues, setValues] = useState<any>({
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

  const [remarkText, setRemarkText] = useState('');

  // Initialize form data when value changes
  useEffect(() => {
    if (!value) return;

    const parts = value.split(' ');

    // Skip if already initialized to prevent loops
    if (frequencyType) return;

    if (parts.length === 6) {
      const [, , hour, , , weekDay] = parts;
      setFrequencyType('weekly');
      setValues((v: any) => ({
        ...v,
        WeeklyDay: Number(weekDay),
        WeeklyHour: Number(hour) + 5,
      }));
    } else if (parts.length === 7) {
      const [, , hour, day, month] = parts;
      const adjustedHour = Number(hour) + 5;

      if (isNumeric(month) && isNumeric(day) && isNumeric(hour)) {
        setFrequencyType('yearly');
        setValues((v: any) => ({
          ...v,
          YearlyMonth: Number(month),
          YearlyDate: Number(day),
          YearlyHour: adjustedHour,
        }));
      } else if (isNumeric(hour) && isNumeric(day)) {
        setFrequencyType('monthly');
        setValues((v: any) => ({
          ...v,
          MonthlyDate: Number(day),
          MonthlyHour: adjustedHour,
        }));
      } else if (isNumeric(hour)) {
        setFrequencyType('daily');
        setValues((v: any) => ({
          ...v,
          DailyHour: adjustedHour,
        }));
      }
    }
  }, [frequencyType, value]); // Only depend on value prop

  useEffect(() => {
    const {
      DailyHour,
      WeeklyDay,
      WeeklyHour,
      MonthlyDate,
      MonthlyHour,
      YearlyMonth,
      YearlyDate,
      YearlyHour,
    } = InputValues;
    setRemarkText('');

    if (frequencyType === 'daily') {
      if (DailyHour) {
        // onChange?.('postingFrequecy',[
        //   '0',
        //   '0',
        //   `${DailyHour - 5}`,
        //   '',
        //   '',
        //   '?',
        //   '*',
        // ].join(' '));
        formRef.current.setFieldValue(
          'postingFrequecy',
          ['0', '0', `${DailyHour - 5}`, '*', '*', '?', '*'].join(' '),
        );
        setRemarkText(`Daily push notifictions at ${DailyHour} o'clock. `);
      } else {
        onChange?.();
      }
    }
    if (frequencyType === 'weekly') {
      if (WeeklyDay && WeeklyHour) {
        formRef.current.setFieldValue(
          'postingFrequecy',
          [
            '0',
            '0',
            `${WeeklyHour - 5}`,
            '?',
            '*',
            WeeklyDay,
            // '*'
          ].join(' '),
        );
        const weekDay = WeekOptions.filter((ele) => ele.value === WeeklyDay)[0]
          .label;
        setRemarkText(
          `Weekly push notifictions on ${weekDay} at ${WeeklyHour} o'clock. `,
        );
      } else {
        onChange?.();
      }
    }
    if (frequencyType === 'monthly') {
      if (MonthlyDate && MonthlyHour) {
        // onChange?.('postingFrequecy',[
        //   '0',
        //   '0',
        //   `${MonthlyHour - 5}`,
        //   MonthlyDate,
        //   '',
        //   '?',
        //   '*',
        // ].join(' '));
        formRef.current.setFieldValue(
          'postingFrequecy',
          ['0', '0', `${MonthlyHour - 5}`, MonthlyDate, '*', '?', '*'].join(
            ' ',
          ),
        );
        setRemarkText(
          `Monthly push notifictions on ${MonthlyDate} at ${MonthlyHour} o'clock. `,
        );
      } else {
        onChange?.();
      }
    }
    if (frequencyType === 'yearly') {
      if (YearlyMonth && YearlyDate && YearlyHour) {
        // onChange?.('postingFrequecy',[
        // '0',
        // '0',
        // `${YearlyHour - 5}`,
        // YearlyDate,
        // YearlyMonth,
        // '?',
        // '*',
        // ].join(' '));
        formRef.current.setFieldValue(
          'postingFrequecy',
          [
            '0',
            '0',
            `${YearlyHour - 5}`,
            YearlyDate,
            YearlyMonth,
            '?',
            '*',
          ].join(' '),
        );
        const Month = YearOptions.filter((ele) => ele.value === YearlyMonth)[0]
          ?.label;
        setRemarkText(
          `Yearly push notifictions on the ${Month}/${YearlyDate} at ${YearlyHour} o'clock. `,
        );
      } else {
        onChange?.();
      }
    }
  }, [InputValues, frequencyType, formRef, onChange]);

  return (
    <Space direction="vertical">
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
          //   setFrequencyType(e.target.value);
          // }
          setFrequencyType(e.target.value);
        }}
        value={frequencyType}
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
              disabled={frequencyType !== 'daily'}
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
              // value={2}
              placeholder="select day of the week"
              disabled={frequencyType !== 'weekly'}
              onChange={(value) => {
                setValues((v: any) => ({ ...v, WeeklyDay: value }));
              }}
              options={WeekOptions}
            />
            <Text>at</Text>
            <Select
              style={{ width: 160 }}
              value={InputValues.WeeklyHour}
              // mode="multiple"
              allowClear
              disabled={frequencyType !== 'weekly'}
              onChange={(value) => {
                setValues((v: any) => ({ ...v, WeeklyHour: value }));
              }}
              placeholder="select hour"
              options={HourOptions}
            />
          </Space>
          <Space direction="horizontal">
            <Radio value={'monthly'}>Monthly: Push notifications on the</Radio>
            <Select
              style={{ width: 160 }}
              // mode="multiple"
              allowClear
              value={InputValues.MonthlyDate}
              disabled={frequencyType !== 'monthly'}
              onChange={(value) => {
                setValues((v: any) => ({ ...v, MonthlyDate: value }));
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
              disabled={frequencyType !== 'monthly'}
              onChange={(value) => {
                setValues((v: any) => ({ ...v, MonthlyHour: value }));
              }}
              placeholder="select hour"
              options={HourOptions}
            />
          </Space>

          <Space direction="horizontal">
            <Radio value={'yearly'}>Yearly: Push notifications on the</Radio>

            <Select
              style={{ width: 130 }}
              // mode="multiple"
              allowClear
              value={InputValues.YearlyMonth}
              disabled={frequencyType !== 'yearly'}
              onChange={(value) => {
                setValues((v: any) => ({ ...v, YearlyMonth: value }));
              }}
              placeholder="select month"
              options={YearOptions}
            />
            <Select
              style={{ width: 130 }}
              // mode="multiple"
              allowClear
              value={InputValues.YearlyDate}
              disabled={frequencyType !== 'yearly'}
              onChange={(value) => {
                setValues((v: any) => ({ ...v, YearlyDate: value }));
              }}
              placeholder="select day"
              options={DateOptions}
            />
            <Text>at</Text>
            <Select
              style={{ width: 130 }}
              // mode="multiple"
              allowClear
              disabled={frequencyType !== 'yearly'}
              onChange={(value) => {
                setValues((v: any) => ({ ...v, YearlyHour: value }));
              }}
              placeholder="select hour"
              value={InputValues.YearlyHour}
              options={HourOptions}
            />
          </Space>
        </Space>
      </Radio.Group>
      {remarkText && (
        <>
          <Text type="success">{remarkText}</Text>
          <Text type="success">
            Please note that the time displayed in posting frequency are all
            based on Kazakhstan (UTC+5) time.
          </Text>
        </>
      )}
    </Space>
  );
};

export default PostingFrequecy;
