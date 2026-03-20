import { getUserManagePushJobDetail } from '@/services/api/tuisongrenwuguanli';
import { getUserManageGroup } from '@/services/api/userService';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { history, useParams } from '@umijs/max';
import { useRequest } from 'ahooks';
import { Button, Space, Typography } from 'antd';
import { useMemo } from 'react';
const { Title, Text } = Typography;

import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone'; // ES 2015
import utc from 'dayjs/plugin/utc'; // ES 2015
// const timezone = require('@dayjs/plugin-timezone');
dayjs.extend(utc);
dayjs.extend(timezone);

export default () => {
  const { id } = useParams<{ id: string }>();

  //   获取group
  const { data: groupList } = useRequest(
    () => getUserManageGroup({ pageNo: 1, pageSize: 99999 }),
    { manual: false },
  );

  const { data: adminPushDetail, loading } = useRequest(
    () => getUserManagePushJobDetail({ id: String(id) }),
    {
      manual: !id || id === 'new',
    },
  );

  const SpecificUsers = useMemo(() => {
    if (adminPushDetail?.data && groupList?.data.list) {
      const { pushTo, inactiveDays } = adminPushDetail?.data.body;
      if (inactiveDays) {
        return <>{`Not opened the app in the last ${inactiveDays} days`}</>;
      }
      if (pushTo === 'all') {
        return <>all users</>;
      } else {
        return (
          <>
            {groupList?.data.list
              .filter((ele) => pushTo.includes(ele.id))
              .map((ele) => ele.groupName)
              .join(',')}
          </>
        );
      }
    } else {
      return <>-</>;
    }
  }, [adminPushDetail?.data, groupList?.data.list]);

  const StopTime = useMemo(() => {
    if (adminPushDetail?.data.body) {
      const { stopTime } = adminPushDetail?.data.body;
      if (stopTime) {
        const datetimeInUTC5 = dayjs(stopTime)
          .add(5, 'hour')
          // .utcOffset('+05:00')
          .format('YYYY-MM-DD HH:mm:ss');
        return `The task will automatically terminate on ${datetimeInUTC5}`;
      } else {
        return '-';
      }
    } else {
      return '-';
    }
  }, [adminPushDetail?.data.body]);

  return (
    <PageContainer
      title={'Task View'}
      extra={<Button onClick={() => history.back()}>Back</Button>}
    >
      <ProCard title={''} style={{ marginBlockEnd: 24 }} loading={loading}>
        <Space direction="vertical" size={10}>
          <Space direction="vertical" size={20}>
            <Title level={4}>Basic information</Title>
            <Space direction="vertical" size={0}>
              <Text style={{ fontWeight: 550 }}>Title</Text>
              <Text>{adminPushDetail?.data.body.title}</Text>
            </Space>

            <Space direction="vertical" size={0}>
              <Text style={{ fontWeight: 550 }}>Content</Text>
              <Text>{adminPushDetail?.data.body.content}</Text>
            </Space>
          </Space>

          <Space direction="vertical" size={20}>
            <Title level={4} style={{ marginTop: 30 }}>
              Target audience
            </Title>
            <Space direction="vertical" size={0}>
              <Text style={{ fontWeight: 550 }}>Specific users</Text>
              <Text>{SpecificUsers}</Text>
            </Space>
          </Space>

          <Space direction="vertical" size={20}>
            <Title level={4} style={{ marginTop: 30 }}>
              Sending settings
            </Title>
            <Space direction="vertical" size={0}>
              <Text style={{ fontWeight: 550 }}>Scheduled sending</Text>
              <Text>{adminPushDetail?.data.remark || '-'}</Text>
            </Space>
            <Space direction="vertical" size={0}>
              <Text style={{ fontWeight: 550 }}>
                Stop the push notifications
              </Text>
              <Text>{StopTime}</Text>
            </Space>
          </Space>

          <Button
            style={{ marginLeft: 180, marginTop: 40 }}
            onClick={() => history.back()}
          >
            Back
          </Button>
        </Space>
      </ProCard>
    </PageContainer>
  );
};
