import ActionsWrap from '@/components/ActionsWrap';
import LinkButton from '@/components/LinkButton';
import { TOKEN } from '@/constants';
import { getOrderManageOrders } from '@/services/api/orderService';
import storage from '@/utils/storage';
import {
  ActionType,
  PageContainer,
  ProCard,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Badge, Button } from 'antd';
import dayjs from 'dayjs';
import { stringify } from 'querystring';
import { useRef, useState } from 'react';

interface Order {
  id?: number;
  orderNo?: string;
  username?: string;
  amount?: number;
  status?: string;
  createdAt?: string;
}

export default () => {
  const actionRef = useRef<ActionType>();
  const [exportParams, setExportParams] = useState<any>();

  const columns: ProColumns<Order>[] = [
    {
      title: 'Order No.',
      dataIndex: 'orderNo',
      editable: false,
      align: 'center',
      render: (_v, record) =>
        record?.orderNo ? <span>{record?.orderNo}</span> : '-',
    },
    {
      title: 'Customer',
      dataIndex: 'username',
      editable: false,
      align: 'center',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      hideInTable: true,
    },
    {
      title: 'Phone number',
      dataIndex: 'phone',
      hideInTable: true,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      editable: false,
      hideInSearch: true,
      align: 'center',
      renderText: (text) => {
        return text ? `$${((text || 0) / 100).toFixed(2)}` : '-';
      },
    },
    {
      title: 'Status',
      dataIndex: 'status', //@pick(['Cancelled','Unpaid','Success'])
      editable: false,
      valueType: 'select',
      valueEnum: {
        Cancelled: 'Cancelled',
        Unpaid: 'Unpaid',
        Success: 'Success',
      },
      align: 'center',
      render: (_v, record) => {
        return (
          <Badge
            status={record?.status === 'Success' ? 'success' : 'default'}
            text={record?.status}
          />
        );
      },
    },
    {
      title: 'Created time',
      dataIndex: 'createdAt',
      align: 'center',
      editable: false,
      render: (_v, record: any) =>
        record?.createdAt
          ? dayjs(record?.createdAt).format('YYYY-MM-DD HH:mm:ss')
          : '-',
      valueType: 'dateRange',
      search: {
        transform: (value) => {
          return {
            minCreatedAt: `${value[0]} 00:00:00`,
            maxCreatedAt: `${value[1]} 23:59:59`,
          };
        },
      },
    },
    {
      title: 'Payment time',
      hideInTable: true,
      valueType: 'dateRange',
      search: {
        transform: (value) => {
          return {
            minPayTime: `${value[0]} 00:00:00`,
            maxPayTime: `${value[1]} 23:59:59`,
          };
        },
      },
    },
    {
      title: 'Action',
      align: 'center',
      dataIndex: 'option',
      fixed: 'right',
      width: 80,
      hideInSearch: true,
      render: (_v, record) => (
        <ActionsWrap max={3}>
          <LinkButton
            onClick={() => {
              history.push('/financial/orderInformation/' + record.id);
            }}
          >
            View
          </LinkButton>
        </ActionsWrap>
      ),
    },
  ];

  return (
    <PageContainer title={'Order Information'}>
      <ProCard title={''} style={{ marginBlockEnd: 24 }}>
        <ProTable<Order>
          actionRef={actionRef}
          rowKey="id"
          search={{
            labelWidth: 100,
          }}
          options={false}
          toolBarRender={() => [
            <Button
              key={'export'}
              type="primary"
              onClick={() => {
                const param: any = { ...exportParams };
                const token = storage.get(TOKEN);

                if (!token) {
                  return;
                }
                if (token) {
                  param.token = token.replace(/"/g, '');

                  console.log(stringify(param));

                  window.open(
                    `${APP_API_HOST}/order/manage/export?${stringify(param)}`,
                  );
                }
              }}
            >
              Export
            </Button>,
          ]}
          request={async (params) => {
            const newParams: any = {
              ...params,
              pageNo: params.current || 1,
              pageSize: params.pageSize || 10,
            };
            delete newParams.size;
            delete newParams.current;

            setExportParams({ ...newParams });

            const {
              data: { list, total },
            } = await getOrderManageOrders({
              ...newParams,
            });

            return {
              data: list || [],
              success: true,
              total,
            };
          }}
          columns={columns}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
          }}
          dateFormatter="string"
        />
      </ProCard>
    </PageContainer>
  );
};
