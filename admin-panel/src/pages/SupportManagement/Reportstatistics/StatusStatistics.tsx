import { getUserManageFeedbackStatusStatistics } from '@/services/api/yonghufankui';
import { useRequest } from 'ahooks';
import { message } from 'antd';
// import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import Chart from './Chart';
// import * as echarts from 'echarts';

export default ({ params = {} }: any) => {
  const { status, titleValue, username, SubmissionAt } = params;

  const [data, setData] = useState<any[]>();

  const { run } = useRequest(getUserManageFeedbackStatusStatistics, {
    manual: true,
    onSuccess(res) {
      if (res.code === 0) {
        setData(res.data);
      } else {
        message.error(res.msg);
      }
    },
  });

  useEffect(() => {
    if (!SubmissionAt) return;
    if (!SubmissionAt?.[0] || !SubmissionAt?.[1]) {
      message.error('Submit time is required and should be complete.');
      return;
    }
    run({
      status,
      titleValue,
      username,
      minSubmissionAt: SubmissionAt?.[0],
      maxSubmissionAt: SubmissionAt?.[1],
    });
  }, [status, titleValue, username, SubmissionAt, run]);

  const options = useMemo(() => {
    if (data) {
      return {
        title: {
          text: 'Title Statistics',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        grid: {
          top: '15%',
          left: '5%',
          right: '5%',
          bottom: '8%',
        },
        xAxis: {
          data: data?.map((ele) => ele.status),
        },
        yAxis: {},
        series: [
          {
            type: 'bar',
            data: data?.map((ele) => ele.quantity),
          },
        ],
      };
    } else {
      return {};
    }
  }, [data]);
  return (
    <>
      <Chart data={data} options={options} />
    </>
  );
};
