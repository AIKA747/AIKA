import { DatePicker, Space, Tag } from 'antd';
import dayjs from 'dayjs';
const { RangePicker } = DatePicker;
// import moment from 'moment';
// import { useEffect } from 'react';
import './date.less';

const arr = [
  {
    startDate: dayjs().add(-7, 'day').format('YYYYMMDD'),
    endDate: dayjs().format('YYYYMMDD'),
    label: '7 days',
  },
  {
    startDate: dayjs().add(-1, 'month').add(1, 'day').format('YYYYMMDD'),
    endDate: dayjs().format('YYYYMMDD'),
    label: '30 days',
  },
  {
    startDate: dayjs().add(-3, 'month').add(1, 'day').format('YYYYMMDD'),
    endDate: dayjs().format('YYYYMMDD'),
    label: '90 days',
  },
  {
    startDate: dayjs().add(-6, 'year').add(1, 'day').format('YYYYMMDD'),
    endDate: dayjs().format('YYYYMMDD'),
    label: '180 days',
  },
];

export default (props: {
  rangeType: { startDate: string; endDate: string; label: string } | undefined;
  setRange: (
    v: { startDate: string; endDate: string; label: string } | object,
  ) => void;
}) => {
  const { rangeType, setRange } = props;
  // useEffect(() => {
  //   const type = sessionStorage.getItem('range-type');
  //   if (!type) {
  //     setRange(arr[0]);
  //   } else {
  //     setRange(JSON.parse(type));
  //   }
  // }, [setRange]);

  return (
    <Space className="data-view-range" direction="horizontal" size={12}>
      {arr.map((ele, index) => (
        <Tag
          key={index}
          onClick={() => {
            setRange({
              startDate: ele.startDate,
              endDate: ele.endDate,
              label: ele.label,
            });
            sessionStorage.setItem('range-type', JSON.stringify(ele));
          }}
          color={rangeType?.label === ele.label ? '#3b5ff9' : ''}
        >
          {ele.label}
        </Tag>
      ))}

      <RangePicker
        allowClear
        onChange={(date, dateString) => {
          if (!!dateString[0].trim() && !!dateString[1].trim()) {
            const ele = {
              startDate: dateString[0] + '',
              endDate: dateString[1] + '',
              label: '自定义',
            };
            setRange(ele);
            sessionStorage.setItem('range-type', JSON.stringify(ele));
          } else {
            setRange({});
            sessionStorage.setItem('range-type', JSON.stringify({}));
          }
        }}
      />
    </Space>
  );
};
