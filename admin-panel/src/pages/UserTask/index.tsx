import ExportExcelButton from '@/components/ExportExcelButton';
import { getBotManageUserTask } from '@/services/api/renwuguanli';
import {
  ActionType,
  PageContainer,
  ProCard,
  ProColumns,
  ProFormInstance,
  ProTable,
} from '@ant-design/pro-components';
import dayjs from 'dayjs';
import { useRef } from 'react';

dayjs.extend(require('dayjs/plugin/timezone'));
dayjs.extend(require('dayjs/plugin/utc'));

export default () => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();

  const exportColumns: ProColumns<any>[] = [
    {
      title: 'User',
      dataIndex: 'userName',
      render: (_v, record) => record?.nickname || record?.username,
      hideInSearch: true,
    },
    {
      title: 'Bot',
      dataIndex: 'botName',
      hideInSearch: true,
    },
    {
      title: 'Task content',
      dataIndex: 'introduction',
      hideInSearch: true,
      width: 460,
      ellipsis: true,
    },
    {
      title: 'Confirm execution',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        PENDING: 'PENDING',
        ENABLED: 'ENABLED',
        DISABLED: 'DISABLED',
      },
    },
    {
      title: 'Execution time',
      dataIndex: 'lastExcetedAt',
      hideInSearch: true,
      render: (_, record) =>
        record.lastExcetedAt
          ? dayjs(record.lastExcetedAt).format('YYYY-MM-DD HH:mm:ss')
          : '-',
    },
    {
      title: 'Generation time',
      dataIndex: 'createdAt',
      hideInSearch: true,
      render: (_, record) =>
        record.createdAt
          ? dayjs(record.createdAt).format('YYYY-MM-DD HH:mm:ss')
          : '-',
    },
  ];

  const columns: ProColumns<any>[] = [
    ...exportColumns,
    {
      title: 'Generation time',
      dataIndex: 'createdAt',
      valueType: 'dateRange',
      width: 100,
      hideInTable: true,
      search: {
        transform: (value: any[]) => {
          return {
            minTime: dayjs(`${value[0]} 00:00:00`)
              .utc()
              .format('YYYY-MM-DD HH:mm:ss'),
            maxTime: dayjs(`${value[1]} 23:59:59`)
              .utc()
              .format('YYYY-MM-DD HH:mm:ss'),
          };
        },
      },
    },
  ];

  return (
    <PageContainer title={'User Task Management'}>
      <ProCard title={'List'} style={{ marginBlockEnd: 24 }}>
        <ProTable
          actionRef={actionRef}
          formRef={formRef}
          rowKey="id"
          search={{
            labelWidth: 'auto',
          }}
          toolBarRender={() => {
            return [
              <ExportExcelButton
                key="export"
                type="primary"
                fileName="User task list "
                columns={exportColumns}
                dataApi={async () => {
                  const values = formRef.current?.getFieldsValue();
                  const searchParams: any = {
                    pageNo: 1,
                    pageSize: 99999,
                  };
                  if (values.createdAt) {
                    const minTime = dayjs(new Date(values.createdAt[0])).utc();
                    searchParams.minTime = minTime.format(
                      'YYYY-MM-DD HH:mm:ss',
                    );
                    searchParams.maxTime = minTime
                      .add(1, 'day')
                      .format('YYYY-MM-DD HH:mm:ss');
                  }
                  if (values.status) {
                    searchParams.status = values.status;
                  }
                  const res = await getBotManageUserTask({
                    ...searchParams,
                    pageNo: 1,
                    pageSize: 99999,
                  });
                  return res?.data?.list || [];
                }}
              >
                Export
              </ExportExcelButton>,
            ];
          }}
          request={async (params) => {
            const newParams: any = {
              ...params,
              pageNo: params.current || 1,
              pageSize: params.pageSize || 10,
            };
            if (params.createdAt) {
              newParams.minTime = dayjs(params.createdAt[0])
                .utc()
                .format('YYYY-MM-DD 00:00:00');
              newParams.maxTime = dayjs(params.createdAt[1])
                .utc()
                .format('YYYY-MM-DD 23:59:59');
            }

            const {
              data: { list, total },
            } = await getBotManageUserTask({
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
