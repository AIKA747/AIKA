import LinkButton from '@/components/LinkButton';
import {
  getBotManageBots,
  putBotManageBotIdUnrecommend,
  putBotManageBotStatus,
} from '@/services/api/jiqirenguanli';
import { getBotManageCategory } from '@/services/api/leixinglanmuguanli';
import {
  ActionType,
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { useRequest } from 'ahooks';
import { Badge, Divider, message } from 'antd';
import React, { useRef } from 'react';

const TableList: React.FC<unknown> = () => {
  const actionRef = useRef<ActionType>();

  const { data: catList } = useRequest(
    () => getBotManageCategory({ pageNo: 1, pageSize: 999 }),
    {
      manual: false,
    },
  );

  const columns = [
    {
      title: 'Bot name',
      dataIndex: 'botName',
      width: 60,
    },
    {
      title: 'Catogery',
      dataIndex: 'categoryName',
      width: 60,
      hideInTable: true,
      valueType: 'select',
      fieldProps: {
        options: (catList?.data?.list || []).map((x: any) => {
          return {
            value: x.categoryId,
            label: x.categoryName,
          };
        }),
      },
      transform(v: any) {
        console.log(v);
        return {
          categoryId: v,
        };
      },
    },
    {
      title: 'Created by',
      dataIndex: 'creatorName',
      valueType: 'text',
      align: 'center',
      width: 60,
      render(creatorName) {
        return creatorName || '-';
      },
    },
    {
      title: 'Chat count',
      dataIndex: 'chatTotal',
      align: 'center',
      width: 80,
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.count - b.count,
      hideInSearch: true,
    },
    {
      title: 'Status',
      dataIndex: 'botStatus',
      width: 80,
      hideInTable: true,
      // hideInsearch: true,
      valueEnum: {
        online: 'online',
        offline: 'offline',
        // unrelease: 'unrelease',
      },
    },
    {
      title: 'Status',
      dataIndex: 'botStatus',
      width: 80,
      hideInSearch: true,
      render: (_v, record) => {
        return (
          <Badge
            status={record?.botStatus === 'online' ? 'success' : 'default'}
            text={record?.botStatus}
          />
        );
      },
    },
    {
      title: 'Visible',
      dataIndex: 'visibled',
      width: 80,
      hideInSearch: true,
      render: (visibled: boolean) => {
        const obj = {
          true: 'Public',
          false: 'Private',
        };
        return (
          <Badge color={visibled ? 'magenta' : 'yellow'} text={obj[visibled]} />
        );
      },
    },
    {
      title: 'Created time',
      dataIndex: 'createdAt',
      valueType: 'dateRange',
      width: 100,
      hideInTable: true,
      search: {
        transform: (value: any[]) => {
          return {
            from: `${value[0]} 00:00:00`,
            to: `${value[1]} 23:59:59`,
          };
        },
      },
    },
    {
      title: 'Created time',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      width: 100,
      hideInSearch: true,
    },
    {
      title: 'Digital human',
      dataIndex: 'digitalHuman',
      hideInTable: true,
      hideInSearch: true,
      valueEnum: {
        yes: 'yes',
        no: 'no',
      },
      width: 100,
    },
    {
      title: 'action',
      dataIndex: 'option',
      valueType: 'option',
      width: 100,
      render: (_, record) => (
        <>
          <LinkButton
            onClick={() => {
              console.log(record);
              history.push(`/bot/user-created/view/${record.id || 0}`);
            }}
          >
            View
          </LinkButton>
          <Divider type="vertical" />
          <LinkButton
            // style={{ color: record.botStatus === 'online' ? 'blue' : 'green' }}
            onClick={() => {
              const { id, botStatus } = record;
              const hide = message.info('processing...');
              putBotManageBotStatus({
                botId: id,
                botStatus: botStatus === 'online' ? 'offline' : 'online',
              })
                .then((res) => {
                  if (res.code === 0) {
                    message.success('Success');
                    hide();
                    actionRef.current?.reload();
                  } else {
                    message.error(res.msg);
                  }
                })
                .catch((err) => {
                  message.error(err);
                });
            }}
          >
            {record.botStatus === 'online' ? 'Offline' : 'Online'}
          </LinkButton>
          <Divider type="vertical" />
          {/* <br />
          <br /> */}
          <LinkButton
            // style={{ color: record.recommend ? 'blue' : 'orange' }}
            onClick={async () => {
              const { id, recommend } = record;
              console.log(record);
              if (recommend) {
                const hide = message.info('processing...');
                const res = await putBotManageBotIdUnrecommend({ id });
                if (res?.code === 0) {
                  message.success('Success');
                  actionRef.current?.reload();
                  hide();
                } else {
                  message.error(res.msg);
                }
              } else {
                history.push(`/bot/explore/edit/${id}`);
              }
            }}
          >
            {record.recommend ? 'Unrecommend' : 'Recommend'}
          </LinkButton>
        </>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.UserInfo>
        headerTitle="Bot List"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        params={{ botSource: 'userCreated' }}
        request={async (params, sorter, filter) => {
          console.log(params, sorter, filter);
          const { data } = await getBotManageBots({
            ...params,
            // FIXME: remove @ts-ignore
            // @ts-ignore
            sorter,
            filter,
            pageNo: params.current || 1,
            pageSize: params.pageSize || 10,
          });
          return {
            data: data.list,
            total: data.total,
            success: true,
          };
        }}
        columns={columns as any}
        pagination={{
          defaultPageSize: 10,
          pageSizeOptions: [5, 10, 20, 50],
          showSizeChanger: true,
        }}
      />
    </PageContainer>
  );
};

export default TableList;
