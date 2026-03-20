import PushTo from '@/components/PushTo';
import { getUserManagePushListId } from '@/services/api/tuisongjilu';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { history, useParams } from '@umijs/max';
import { useRequest } from 'ahooks';
import type { DescriptionsProps } from 'antd';
import { Button, Descriptions } from 'antd';

export default () => {
  const { id } = useParams<{ id: string }>();

  const { data: adminPushDetail, loading } = useRequest(
    () => getUserManagePushListId({ id: String(id) }),
    {
      manual: !id || id === 'new',
    },
  );

  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Title',
      children: adminPushDetail?.data?.title,
    },
    {
      key: '2',
      label: 'Content',
      children: adminPushDetail?.data?.content,
    },
    {
      key: '3',
      label: 'Push to',
      children: (
        <PushTo
          forDisplay={true}
          disabled
          value={adminPushDetail?.data?.pushTo}
        />
      ),
    },
    {
      key: '4',
      label: 'Sound alert',
      children: adminPushDetail?.data?.soundAlert ? 'Yes' : 'No',
    },
    {
      key: '5',
      label: 'Total sended',
      children: adminPushDetail?.data?.pushTotal || '-',
    },
    {
      key: '6',
      label: 'Received',
      children: adminPushDetail?.data?.received || '-',
    },
  ];

  return (
    <PageContainer
      title={'Record View'}
      extra={<Button onClick={() => history.back()}>Back</Button>}
    >
      <ProCard title={''} style={{ marginBlockEnd: 24 }} loading={loading}>
        <Descriptions
          title=""
          items={items}
          column={1}
          labelStyle={{
            width: 160,
            display: 'block',
            textAlign: 'right',
            color: 'rgba(0, 0, 0, 0.88)',
          }}
          contentStyle={{ paddingLeft: 20 }}
        />
        <Button
          style={{ marginLeft: 180, marginTop: 40 }}
          onClick={() => history.back()}
        >
          Back
        </Button>
      </ProCard>
    </PageContainer>
  );
};
