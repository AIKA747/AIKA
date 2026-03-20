import { getAdminSmsLogs } from '@/services/api/rizhichaxun';
import {
  ActionType,
  PageContainer,
  ProCard,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
// import { Typography } from 'antd';
import dayjs from 'dayjs';
import { useRef } from 'react';

// const { Link } = Typography;

interface AdminSms {
  phone?: string;
  content?: string;
  status?: string;
  sendTime?: string;
}

export default () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<AdminSms>[] = [
    {
      title: 'Phone number',
      dataIndex: 'phone',
      editable: false,
      align: 'center',
      width: 150,
      render: (_v, record) => (
        <span style={{ color: '#1890FF' }}>{record?.phone}</span>
      ),
    },
    {
      title: 'Content',
      dataIndex: 'content',
      editable: false,
      align: 'center',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      editable: false,
      width: 150,
      valueType: 'select',
      valueEnum: {
        Success: 'Success',
        Failed: 'Failed',
      },
      align: 'center',
    },
    {
      title: 'Send Time',
      width: 150,
      dataIndex: 'sendTime',
      align: 'center',
      editable: false,
      render: (_v, record: any) =>
        record?.sendTime
          ? dayjs(record?.sendTime).format('YYYY-MM-DD HH:mm:ss')
          : '-',
      valueType: 'dateRange',
      search: {
        transform: (value) => {
          return {
            minSendTime: `${value[0]}`,
            maxSendTime: `${value[1]}`,
          };
        },
      },
    },
  ];

  return (
    <PageContainer title={'SMS log'}>
      <ProCard title={''} style={{ marginBlockEnd: 24 }}>
        <ProTable<AdminSms>
          actionRef={actionRef}
          rowKey="id"
          headerTitle="SMS Log List"
          search={{
            labelWidth: 110,
          }}
          options={false}
          request={async (params) => {
            const newParams: any = {
              ...params,
              pageNo: params.current || 1,
              pageSize: params.pageSize || 10,
            };
            delete newParams.size;
            delete newParams.current;

            const {
              data: { list, total },
            } = await getAdminSmsLogs({
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
