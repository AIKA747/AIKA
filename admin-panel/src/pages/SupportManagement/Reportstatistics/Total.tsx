import { getUserManageFeedbackReportQuantity } from '@/services/api/yonghufankui';
import { useRequest } from 'ahooks';
import { message } from 'antd';
// import dayjs from 'dayjs';
import * as echarts from 'echarts';
import { useEffect, useMemo, useState } from 'react';
import Chart from './Chart';

export default ({ params = {} }: any) => {
  const { status, titleValue, username, SubmissionAt } = params;
  console.log(SubmissionAt);

  const [data, setData] = useState<any[]>();

  const { run } = useRequest(getUserManageFeedbackReportQuantity, {
    manual: true,
    onSuccess(res) {
      if (res.code === 0) {
        setData(res.data);
      } else {
        message.error(res.msg);
      }
    },
  });

  // //自己滚动图表
  // var timeOut = null
  // myChart.on('mouseover', stop);

  // myChart.on('mouseout', goMove);

  // autoMove()
  // function autoMove() {
  //   timeOut = setInterval(() => {

  //     if (Number(option.dataZoom[0].end) > 100) {
  //       option.dataZoom[0].end = 20;
  //       option.dataZoom[0].start = 0;
  //     }
  //     else {
  //       option.dataZoom[0].end = option.dataZoom[0].end + 1 * (100 / option.series[0].data.length);
  //       option.dataZoom[0].start = option.dataZoom[0].start + 1 * (100 / option.series[0].data.length);
  //     }
  //     myChart.setOption(option);
  //   }, 2500);
  // }
  // //停止滚动
  // function stop() {
  //   clearInterval(timeOut)
  // }
  // //继续滚动
  // function goMove() {
  //   autoMove()

  // }

  const options = useMemo(() => {
    if (data) {
      let datax = data.map((ele) => ele.dayId);
      //引镇入库
      let datay1 = data.map((ele) => ele.userCount);
      //引镇出库
      let datay2 = data.map((ele) => ele.reportQuantity);

      const options = {
        title: {
          text: 'Total',
        },
        backgroundColor: '#fff',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {
          data: ['userCount', 'reportQuantity'],
          align: 'right',
          top: '15',
          right: 10,
          textStyle: {
            color: '#333',
          },
          itemWidth: 10,
          itemHeight: 10,
          itemGap: 15,
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: datax,
            axisLine: {
              show: true,
              lineStyle: {
                //     color: "#fff",
                width: 1,
                type: 'solid',
              },
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: true,
              rotate: 45,
              textStyle: {
                color: '#333',
              },
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              fontSize: '10',
              // formatter: '{value} %'
            },
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,

              lineStyle: {
                color: '#333',
                width: 1,
                type: 'solid',
              },
            },
            splitLine: {
              lineStyle: {
                type: 'dashed',
                color: '#666666',
              },
            },
          },
        ],
        dataZoom: [
          //给x轴设置滚动条
          {
            start: 0, //默认为0
            end: 100 - 1500 / 31, //默认为100
            type: 'slider',
            show: true,
            xAxisIndex: [0],
            handleSize: 10, //滑动条的 左右2个滑动条的大小
            height: 13, //组件高度
            left: 50, //左边的距离
            right: 40, //右边的距离
            bottom: 0, //右边的距离
            handleColor: '#ddd', //h滑动图标的颜色
            handleStyle: {
              borderColor: '#cacaca',
              borderWidth: '1',
              shadowBlur: 2,
              background: '#ddd',
              shadowColor: '#ddd',
            },
            fillerColor: '#808080',
            backgroundColor: '#ddd', //两边未选中的滑动条区域的颜色
            showDataShadow: false, //是否显示数据阴影 默认auto
            showDetail: false, //即拖拽时候是否显示详细数值信息 默认true
            handleIcon:
              'M-292,322.2c-3.2,0-6.4-0.6-9.3-1.9c-2.9-1.2-5.4-2.9-7.6-5.1s-3.9-4.8-5.1-7.6c-1.3-3-1.9-6.1-1.9-9.3c0-3.2,0.6-6.4,1.9-9.3c1.2-2.9,2.9-5.4,5.1-7.6s4.8-3.9,7.6-5.1c3-1.3,6.1-1.9,9.3-1.9c3.2,0,6.4,0.6,9.3,1.9c2.9,1.2,5.4,2.9,7.6,5.1s3.9,4.8,5.1,7.6c1.3,3,1.9,6.1,1.9,9.3c0,3.2-0.6,6.4-1.9,9.3c-1.2,2.9-2.9,5.4-5.1,7.6s-4.8,3.9-7.6,5.1C-285.6,321.5-288.8,322.2-292,322.2z',
            filterMode: 'filter',
          },
          //下面这个属性是里面拖到
          {
            type: 'inside',
            show: true,
            xAxisIndex: [0],
            start: 0, //默认为1
            end: 100 - 1500 / 31, //默认为100
          },
        ],
        series: [
          {
            name: 'userCount',
            type: 'bar',
            data: datay1,
            barWidth: 8, //柱子宽度
            barGap: 0.5, //柱子之间间距
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: '#008cff',
                  },
                  {
                    offset: 1,
                    color: '#005193',
                  },
                ]),
                opacity: 1,
              },
            },
          },
          {
            name: 'reportQuantity',
            type: 'bar',
            data: datay2,
            barWidth: 8,
            barGap: 0.5,
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: '#00da9c',
                  },
                  {
                    offset: 1,
                    color: '#007a55',
                  },
                ]),
                opacity: 1,
              },
            },
          },
        ],
      };
      return options;
    } else {
      return {};
    }
  }, [data]); // datax, datay1, datay2, datay3, datay4

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

  return (
    <>
      <Chart data={data} options={options} />
    </>
  );
};
