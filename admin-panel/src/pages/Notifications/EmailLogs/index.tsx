import { getAdminEmailLogs } from '@/services/api/rizhichaxun';
import {
  ActionType,
  PageContainer,
  ProCard,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { Space } from 'antd';
import dayjs from 'dayjs';
import { useRef } from 'react';

interface AdminEmail {
  email?: string;
  content?: string;
  status?: string;
  sendTime?: string;
}

export default () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<AdminEmail>[] = [
    {
      title: 'Email',
      dataIndex: 'email',
      editable: false,
      align: 'center',
      width: 150,
      render: (_v, record) => (
        <span style={{ color: '#1890FF' }}>{record?.email}</span>
      ),
    },
    {
      title: 'Content',
      dataIndex: 'content',
      editable: false,
      align: 'left',
      width: 350,
      render: (content) => {
        const { description, url, remarks } = JSON.parse(content);
        return (
          <Space size={10} direction="vertical">
            <div style={{ display: 'flex' }}>
              <div
                style={{
                  textAlign: 'right',
                  color: 'orangered',
                  width: '20%',
                  marginRight: 5,
                }}
              >
                Description:{' '}
              </div>
              <div style={{ display: 'block', width: '80%' }}>
                {description}
              </div>
            </div>
            <div style={{ display: 'flex' }}>
              <div
                style={{
                  textAlign: 'right',
                  color: 'orangered',
                  width: '20%',
                  marginRight: 5,
                }}
              >
                Url:{' '}
              </div>
              <span style={{ display: 'block', width: '80%' }}>{url}</span>
            </div>
            <div style={{ display: 'flex' }}>
              <div
                style={{
                  textAlign: 'right',
                  color: 'orangered',
                  width: '20%',
                  marginRight: 5,
                }}
              >
                Remarks:{' '}
              </div>
              <span style={{ display: 'block', width: '80%' }}>{remarks}</span>
            </div>
          </Space>
        );
      },
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
            minSendTime: `${value[0]} 00:00:00`,
            maxSendTime: `${value[1]} 23:59:59`,
          };
        },
      },
    },
  ];

  return (
    <PageContainer title={'Email log'}>
      <ProCard title={''} style={{ marginBlockEnd: 24 }}>
        <ProTable<AdminEmail>
          actionRef={actionRef}
          rowKey="id"
          headerTitle="Email Log List"
          search={{
            labelWidth: 110,
          }}
          // options={false}
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
            } = await getAdminEmailLogs({
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
