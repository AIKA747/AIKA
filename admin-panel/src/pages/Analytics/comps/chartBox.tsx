import { debounce } from '@/utils';
import { useRequest } from 'ahooks';
import dayjs from 'dayjs';
import * as echarts from 'echarts';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import './chart.less';

const ChartBox = (props: any) => {
  const { api, CountryDataList, label, type, color, params, formateType } =
    props;
  const ref = useRef<any>();
  // console.log(dayjs('20240305').format('YYYY.MM.DD'));

  const { data } = useRequest(() => api({ ...params }), {
    refreshDeps: [params],
  });

  // const option = useMemo(
  //   () => ({
  //     title: {
  //       text: label + ' Trend',
  //       textStyle: {
  //         align: 'center',
  //         color: '#666',
  //         fontSize: 15,
  //         fontWeight: 400,
  //       },
  //       top: '3%',
  //       left: '1%',
  //     },
  //     xAxis: {
  //       type: 'category',
  //       data: data?.data?.map((ele) => ele.dateXaxis) || [],
  //       axisLine: {
  //         show: true, //隐藏X轴轴线
  //         // symbol: ['none', 'arrow'],
  //         lineStyle: {
  //           color: '#444',
  //           width: 1,
  //         },
  //       },
  //     },
  //     yAxis: {
  //       type: 'value',
  //       axisLine: {
  //         show: true, //隐藏X轴轴线
  //         // symbol: ['none', 'arrow'],
  //         lineStyle: {
  //           color: '#444',
  //           width: 1,
  //         },
  //       },
  //       splitLine: {
  //         show: false,
  //       },
  //       axisTick: {
  //         show: true,
  //       },
  //     },
  //     series: [
  //       {
  //         data:
  //           formateType === 'income'
  //             ? data?.data?.map((ele) => (ele.numYaxis / 100).toFixed(2)) || []
  //             : data?.data?.map((ele) => ele.numYaxis) || [],
  //         type: 'line',
  //         lineStyle: {
  //           normal: {
  //             width: 1,
  //             type: 'solid',
  //             color: {
  //               type: 'linear',
  //               // x: 0,
  //               // y: 0,
  //               // x2: 0,
  //               // y2: 1,
  //               colorStops: [
  //                 // {
  //                 //   offset: 0,
  //                 //   color: 'blue', // 0% 处的颜色
  //                 // },

  //                 {
  //                   offset: 1,
  //                   color: color, // 100% 处的颜色
  //                 },
  //               ],
  //               global: false, // 缺省为 false
  //             },
  //           },
  //         },
  //         symbol: 'circle', // 折线点设定为实心点
  //         symbolSize: 1, // 设定折线点的大小
  //         itemStyle: {
  //           show: false,
  //           normal: {
  //             color: 'blue',
  //             borderColor: 'red',
  //             borderWidth: 0,
  //           },
  //         }, //在单个图表实例中存在多个y轴的时候有用
  //       },
  //     ],
  //   }),
  //   [data, label, color],
  // );

  const option2 = useMemo(
    () => ({
      //color: '#4dd0c8', //折线颜色
      title: {
        text: label + ' Trend',
      },
      // 配置提示信息：
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器配置项。
          type: 'cross', // 'line' 直线指示器  'shadow' 阴影指示器  'none' 无指示器  'cross' 十字准星指示器。
          axis: 'auto', // 指示器的坐标轴。
          snap: true, // 坐标轴指示器是否自动吸附到点上
        },
        showContent: true,
      },
      //图表显示区域
      grid: {
        top: '20%',
        left: '3%',
        right: '4%',
        bottom: '3%',
        // 显示边框
        show: false,
        containLabel: true,
      },
      dataZoom: [
        {
          type: 'slider', // 设置为滑动条型式
          show: true, // 显示dataZoom组件
          start: 0, // 默认显示的起始位置为0
          end: 30, // 默认显示的结束位置为100
          handleSize: 8, // 滑动条的手柄大小
          handleStyle: {
            color: '#DCE2E8', // 滑动条的手柄颜色
          },
          xAxisIndex: [0], // 表示控制第一个x轴
          filterMode: 'filter', // 设置为filter模式，即数据超过范围时会被过滤掉
        },
      ],
      xAxis: {
        type: 'category',
        axisTick: {
          show: false,
        },
        axisLine: {
          show: true, //去除轴线
          lineStyle: {
            color: '#DCE2E8', //设置x轴轴线颜色
          },
        },
        axisLabel: {
          rotate: 45, // X 轴标签文字旋转角度
          //坐标轴刻度标签的显示间隔，在类目轴中有效。默认会采用标签不重叠的策略间隔显示标签。可以设置成 0 强制显示所有标签。
          interval: 0,
          textStyle: {
            color: '#556677',
          },
          fontSize: 12,
          formatter: function (value, index) {
            if (index >= 12) {
              return ''; // 超过12条数据的标签不显示
            } else {
              return value;
            }
          },
        },
        boundaryGap: false, //去除轴间距
        // data: ['06-04', '06-05', '06-06', '06-07', '06-08', '06-09', '06-10', '06-11', '06-12', '06-13', '06-14', '06-15', '06-16', '06-17', '06-18', '06-19', '06-20', '06-21', '06-22', '06-23', '06-24', '06-25', '06-26', '06-27', '06-28', '06-29', '06-30', '07-01', '07-02', '07-03'],
        data:
          data?.data?.map((ele) => dayjs(ele.dateXaxis).format('YYYY.MM.DD')) ||
          [],
      },
      yAxis: {
        type: 'value',
        axisTick: {
          show: false, //去除y轴刻度线
        },
        axisLabel: {
          textStyle: {
            color: '#556677',
          },
        },
        axisLine: {
          show: true, //显示y轴轴线
          lineStyle: {
            color: '#DCE2E8',
          },
        },
        splitLine: {
          //坐标轴在 grid 区域中的分隔线。
          show: false,
        },
      },
      series: [
        {
          // data: [1289886.67, 626059.41, 642731.08, 654504.52, 681944.61, 880283.5, 1477209.16, 1363323.44, 625328.36, 663323.71, 699980.69, 742812.11, 967688.17, 1446161.37, 1543749.14, 646472.84, 748964.15, 936463.81, 1612093.01, 1371712.41, 1233419.16, 702205.29, 712268.52, 783523.87, 854010, 813679.34, 1000449.75, 1448029.06, 1353368.1, 782741.25],
          data:
            formateType === 'income'
              ? data?.data?.map((ele) => (ele.numYaxis / 100).toFixed(2)) || []
              : data?.data?.map((ele) => ele.numYaxis) || [],
          type: 'line',
          smooth: true,
          symbol: 'circle',
          itemStyle: {
            normal: {
              label: {
                show: true,
                textStyle: {
                  color: '#cab8fe', //折线点上对应字体颜色
                },
              },
              // lineStyle: {
              //   color: 'rgba(0,0,0,0)'// 折线颜色设置为0，即只显示点，不显示折线
              // },
              // color: "#4dd0c8",  //折线点颜色  #fc5531
              color: color, //折线点颜色  #fc5531
            },
          },
        },
      ],
    }),
    [data, label, color],
  );
  // console.log(option2);

  const resizeFunc = useCallback(() => {
    if (ref.current) {
      const BarBOX1 = echarts?.init(ref.current);
      BarBOX1?.setOption(option2);
      let resize = debounce(() => {
        BarBOX1.resize();
      });
      resize();
    }
  }, [option2]);

  useEffect(() => {
    window.addEventListener('resize', resizeFunc);

    const main = document.querySelectorAll('main.parsec-layout-content')[0];
    let resizeObserver = new ResizeObserver(resizeFunc);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    main && resizeObserver.observe(main); //监听main的变化。切换tab时如何解绑？

    return () => {
      // window.removeEventListener('resize', resizeFunc); // 可以顺利解绑
      // resizeObserver.disconnect();
    };
  }, [data, option2, resizeFunc]);

  return (
    <div id="chart-box" style={{ height: 400, width: '100%', display: 'flex' }}>
      <div ref={ref} style={{ height: '100%', width: '70%' }}></div>
      <div style={{ height: '100%', width: '30%' }}>
        <h3>{`${type} Count Ranking By Country`}</h3>
        {CountryDataList?.map((ele, index) => {
          return (
            <div
              className="count-item"
              key={index}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span className="num">{index + 1}</span>
              <span className="desc">{ele.country}</span>
              <span className="amount">{ele.data}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChartBox;
