import { getAdminResources } from '@/services/api/quanxianguanli';
import { getAdminOperationLogs } from '@/services/api/rizhichaxun';
import {
  ActionType,
  PageContainer,
  ProCard,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';
import './index.less';

interface AdminOperationLogs {
  adminName?: string;
  module?: string;
  record?: string;
  initialValue?: string;
  finalValue?: string;
  operatedTime?: string;
  action?: string;
}

interface MenuItem {
  id?: number;
  name?: string;
  childrens?: MenuItem[];
}

export default () => {
  const actionRef = useRef<ActionType>();
  const [moduleList, setModuleList] = useState<
    { id?: number; name?: string }[]
  >([]);

  const menuTree = (tree: MenuItem[]) => {
    tree.forEach((x) => {
      moduleList.push({
        name: x.name,
        id: x.id,
      });
      setModuleList([...moduleList]);
      if (x.childrens && !!x.childrens.length) {
        menuTree(x.childrens);
      } else {
        return;
      }
    });
  };

  // 菜单列表
  useRequest(getAdminResources, {
    manual: false,
    onSuccess: (response) => {
      menuTree(response?.data || []);
    },
  });

  const columns: ProColumns<AdminOperationLogs>[] = [
    {
      title: 'Administrator',
      dataIndex: 'adminName',
      editable: false,
      align: 'center',
      width: 100,
      hideInSearch: true,
    },
    {
      title: 'Administrator',
      dataIndex: 'username',
      editable: false,
      align: 'center',
      width: 100,
      hideInTable: true,
    },
    {
      title: 'Module',
      dataIndex: 'module',
      editable: false,
      align: 'center',
      width: 100,
      valueType: 'select',
      fieldProps: {
        options: ['admin', 'bot', 'user', 'order', 'content'].map((x) => {
          return {
            value: x,
            label: x,
          };
        }),
      },

      // fieldProps: {
      //   options: (moduleList || []).map((x) => {
      //     return {
      //       value: x.id,
      //       label: x.name,
      //     };
      //   }),
      // },
    },
    {
      title: 'Record',
      dataIndex: 'record',
      editable: false,
      align: 'center',
      // width: '15%',
      width: 100,
    },
    {
      title: 'Initial Value/Final Value',
      dataIndex: 'initialValue',
      // width: '30%',
      width: 300,
      editable: false,
      hideInSearch: true,
      hideInTable: true,
      align: 'center',
      className: 'initial-value-limit', //有效(max-width),但却又不是受max-width的真实数值决定
      renderText: (text, record) => {
        // maxWidth:'65%',overflow:'scroll', 无效
        return (
          <div
            style={{ wordWrap: 'break-word' }}
          >{`${text}/${record?.finalValue}`}</div>
        );
      },
    },
    {
      title: 'Operated Time',
      dataIndex: 'operatedTime',
      align: 'center',
      editable: false,
      render: (_v, record: any) =>
        record?.operatedTime
          ? dayjs(record?.operatedTime).format('YYYY-MM-DD HH:mm:ss')
          : '-',
      valueType: 'dateRange',
      search: {
        transform: (value) => {
          return {
            minOperatedTime: `${value[0]} 00:00:00`,
            maxOperatedTime: `${value[1]} 23:59:59`,
          };
        },
      },
      width: 100,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      editable: false,
      align: 'center',
      valueType: 'select',
      valueEnum: {
        POST: 'POST',
        PATCH: 'PATCH',
        PUT: 'PUT',
        DELETE: 'DELETE',
      },
      width: 100,
    },
  ];

  return (
    <PageContainer title={'Operation log'}>
      <ProCard title={false} style={{ marginBlockEnd: 24 }}>
        <ProTable<AdminOperationLogs>
          actionRef={actionRef}
          rowKey="id"
          headerTitle="Operation Log List"
          search={{
            labelWidth: 120,
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
            } = await getAdminOperationLogs({
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
          scroll={{
            x: 1300,
          }}
          dateFormatter="string"
        />
      </ProCard>
    </PageContainer>
  );
};
