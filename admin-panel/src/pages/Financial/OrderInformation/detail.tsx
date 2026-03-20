import { getOrderManageOrderId } from '@/services/api/orderService';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { history, useParams } from '@umijs/max';
import { useRequest } from 'ahooks';
import {
  Button,
  Col,
  Descriptions,
  DescriptionsProps,
  message,
  Row,
} from 'antd';
import dayjs from 'dayjs';

export default () => {
  const { id } = useParams<{ id: string }>();
  // 获取订单详情
  const { data, loading } = useRequest(
    () =>
      getOrderManageOrderId({
        id,
      }),
    {
      manual: !id,
      onSuccess(res) {
        if (res.code !== 0) {
          message.error(res.msg);
        }
      },
    },
  );

  // Order Info
  const orderInfoItems: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Order No',
      children: data?.data?.orderNo,
    },
    {
      key: '2',
      label: 'Created time',
      children: data?.data?.createdAt
        ? dayjs(data?.data?.createdAt).format('YYYY-MM-DD HH:mm:ss')
        : '-',
    },
    {
      key: '3',
      label: 'Customer',
      children: data?.data?.username,
    },
    {
      key: '4',
      label: 'Email',
      children: data?.data?.email,
    },
    {
      key: '5',
      label: 'Phone number',
      children: data?.data?.phone || '-',
    },
    {
      key: '6',
      label: 'Item',
      children: data?.data?.packageName,
    },
    {
      key: '7',
      label: 'Amount',
      children: '$' + (data?.data?.amount || 0) / 100,
    },
    {
      key: '8',
      label: 'Status',
      children: data?.data?.status,
    },
  ];

  // Payment Info
  const paymentInfoItems: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Payment method',
      children: data?.data?.paymentInfo
        ? data?.data?.paymentInfo[0]?.payMethod
        : '-',
    },
    {
      key: '2',
      label: 'Payment amount',
      children: data?.data?.paymentInfo
        ? '$' + (data?.data?.paymentInfo[0]?.amount || 0) / 100
        : '$0.00',
    },
    {
      key: '3',
      label: 'Payment  No.',
      children: data?.data?.paymentInfo
        ? data?.data?.paymentInfo[0]?.payNo
        : '-',
    },
    {
      key: '4',
      label: 'Payment time',
      children: data?.data?.paymentInfo
        ? data?.data?.paymentInfo[0]?.payTime
          ? dayjs(data?.data?.paymentInfo[0]?.payTime).format(
              'YYYY-MM-DD HH:mm:ss',
            )
          : '-'
        : '-',
    },
  ];

  const labelStyle = {
    textAlign: 'right',
    width: 150,
    display: 'block',
    color: 'rgba(0, 0, 0, 0.88)',
  };
  const contentStyle = { paddingLeft: 26, width: 200 };

  const descriptionsTitle = (title: string) => (
    <div style={{ width: 142, textAlign: 'right' }}>{title}</div>
  );

  return (
    <PageContainer
      title={'View'}
      extra={<Button onClick={() => history.back()}>Back</Button>}
    >
      <ProCard
        loading={loading}
        title={''}
        style={{ marginBlockEnd: 24, textAlign: 'center' }}
      >
        <Row>
          <Col span={12}>
            <Descriptions
              style={{ borderRight: '1px solid #eee' }}
              column={1}
              title={descriptionsTitle('Order Info')}
              items={orderInfoItems}
              labelStyle={labelStyle}
              contentStyle={contentStyle}
            />
          </Col>
          <Col span={12}>
            <Descriptions
              column={1}
              title={descriptionsTitle('Payment Info')}
              items={paymentInfoItems}
              labelStyle={labelStyle}
              contentStyle={contentStyle}
            />
          </Col>
        </Row>
        <Button
          style={{ marginTop: 120, marginBottom: 20 }}
          onClick={() => history.back()}
        >
          Back
        </Button>
      </ProCard>
    </PageContainer>
  );
};
