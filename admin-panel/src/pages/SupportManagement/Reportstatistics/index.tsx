import { getBotManageDic } from '@/services/api/botService';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import { Button, Col, DatePicker, Input, message, Row, Select } from 'antd';
import dayjs from 'dayjs';
// import moment from 'moment';
import { useEffect, useState } from 'react';
import StatusStatistics from './StatusStatistics';
import TitleStatistics from './TitleStatistics';
import Total from './Total';
const { RangePicker } = DatePicker;

// 获取上月今天和当天日期的JavaScript函数 ['2024-06-28', '2024-07-28']
function getLastMonthAndTodayDates() {
  const today = new Date();
  const lastMonth = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    today.getDate(),
  );

  // 处理当月天数多于上月的情况（如3月31日的上月日期应该是2月28日或29日）
  if (lastMonth.getMonth() === today.getMonth()) {
    lastMonth.setDate(0); // 设置为上月的最后一天
  }

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return [formatDate(lastMonth), formatDate(today)];
}
export default () => {
  // console.log(getLastMonthAndTodayDates());

  const [Titles, setTitles] = useState<{ label: string; value: string }[]>([]);
  useRequest(() => getBotManageDic({ dicType: 'feedbackTitle' }), {
    onSuccess(res) {
      setTitles(
        res.data.map((ele) => {
          const { dicValue } = ele;
          return {
            label: dicValue,
            value: dicValue,
          };
        }),
      );
    },
  });

  const dateFormat = 'YYYY-MM-DD'; // 接口要求的格式

  const [status, setStatus] = useState();
  const [titleValue, setTitleValue] = useState();
  const [username, setUsername] = useState();
  const [SubmissionAt, setSubmissionAt] = useState<any>(
    getLastMonthAndTodayDates(),
  );

  const [params, setParams] = useState();

  useEffect(() => {
    setParams({
      status,
      titleValue,
      username,
      SubmissionAt,
    });
  }, []);

  return (
    <PageContainer title={'Report statistics'}>
      <ProCard title={''} style={{ marginBlockEnd: 24 }}>
        <Row style={{ marginBottom: 20 }}>
          <Col span={2}>Submit Time</Col>
          <Col span={5}>
            <RangePicker
              // defaultValue={}
              value={[
                SubmissionAt[0] ? dayjs(SubmissionAt[0]) : undefined,
                SubmissionAt[1] ? dayjs(SubmissionAt[1]) : undefined,
              ]}
              format={dateFormat}
              onChange={(dates, dateStrings) => {
                // console.log(dates,dateStrings);

                setSubmissionAt(dateStrings);
              }}
            />
          </Col>
          <Col span={1}></Col>
          <Col span={2}>Username</Col>
          <Col span={4}>
            <Input
              placeholder="Please enter"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              allowClear
            />
          </Col>
        </Row>
        <Row>
          <Col span={2}>Status</Col>
          <Col span={5}>
            <Select
              allowClear
              placeholder="Please select"
              style={{ width: '100%' }}
              onChange={(v) => {
                // console.log(e);
                setStatus(v);
              }}
              options={[
                {
                  label: 'underReview',
                  value: 'underReview',
                },
                {
                  label: 'pending',
                  value: 'pending',
                },
                {
                  label: 'rejected',
                  value: 'rejected',
                },
                {
                  label: 'completed',
                  value: 'completed',
                },
                {
                  label: 'withdraw',
                  value: 'withdraw',
                },
              ]}
            />
          </Col>
          <Col span={1}></Col>
          <Col span={2}>Title</Col>
          <Col span={10}>
            <Select
              allowClear
              placeholder="Please select"
              style={{ width: '100%' }}
              onChange={(v) => {
                setTitleValue(v);
              }}
              options={Titles}
            />
          </Col>
        </Row>
      </ProCard>

      <Row style={{ marginBottom: 20 }}>
        <Col span={10}></Col>
        <Col span={4}>
          <Button
            type="primary"
            onClick={() => {
              if (
                !SubmissionAt ||
                SubmissionAt.filter((ele) => ele).length < 2
              ) {
                message.error('Submit time is not complete.');
                return;
              }
              setParams({
                status,
                titleValue,
                username,
                SubmissionAt,
              });
            }}
          >
            View results
          </Button>
        </Col>
        <Col span={10}></Col>
      </Row>
      <ProCard title={''} style={{ marginBlockEnd: 24 }}>
        <Total params={params} />
      </ProCard>

      <ProCard title={''} style={{ marginBlockEnd: 24 }}>
        <TitleStatistics params={params} />
      </ProCard>

      <ProCard title={''} style={{ marginBlockEnd: 24 }}>
        <StatusStatistics params={params} />
      </ProCard>
    </PageContainer>
  );
};
