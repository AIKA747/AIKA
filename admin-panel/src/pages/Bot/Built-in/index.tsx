import ActionsWrap from '@/components/ActionsWrap';
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
import { Access, history } from '@umijs/max';
import { useRequest } from 'ahooks';
import { Badge, Button, message, Typography } from 'antd';
import { useEffect, useRef, useState } from 'react';
const { Link } = Typography;

export default () => {
  const actionRef = useRef<ActionType>();

  const { data: catList } = useRequest(
    () => getBotManageCategory({ pageNo: 1, pageSize: 99999 }),
    {
      manual: false,
    },
  );

  const [buttonRole, setButtonRole] = useState<any[]>();

  useEffect(() => {
    const roles = localStorage.getItem('buttonRole');
    console.log('buttonRole', roles);
    if (roles) {
      // 得到当前页的button权限
      const allButtonRoles = JSON.parse(roles);
      setButtonRole(allButtonRoles['Bot Built-in']);
    }
  }, []);

  // 辅助函数：检查是否有 某按钮 权限
  const hasPermission = (buttonName: string): boolean => {
    if (!buttonRole || !Array.isArray(buttonRole)) {
      return false; // 如果 buttonRole 为空或不是数组，返回 false
    }
    return buttonRole.some((role) => role.name === buttonName); // 使用 some 方法提高性能
  };

  const columns = [
    {
      title: 'Bot name',
      dataIndex: 'botName',
      width: 100,
      render: (botName: any, record: any) =>
        record?.botName ? (
          <Link href="https://ant.design" target="_blank">
            {botName}
          </Link>
        ) : (
          '-'
        ),
    },
    {
      title: 'Catogery',
      dataIndex: 'categoryName',
      width: 60,
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
        return {
          categoryId: v,
        };
      },
    },
    {
      title: 'Chat count',
      dataIndex: 'chatTotal',
      align: 'center',
      width: 80,
      defaultSortOrder: 'descend',
      sorter: (a: any, b: any) => a.chatTotal - b.chatTotal,
      hideInSearch: true,
    },
    // {
    //   title: 'Digital human',
    //   dataIndex: 'digitalHuman',
    //   hideInTable: true,
    //   hideInSearch: true,
    //   valueEnum: {
    //     yes: 'yes',
    //     no: 'no',
    //   },
    //   width: 100,
    // },
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
      render: (_v: any, record: any) => {
        return (
          <Badge
            status={record?.botStatus === 'online' ? 'success' : 'default'}
            text={record?.botStatus}
          />
        );
      },
      hideInSearch: true,
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
      title: 'Action',
      dataIndex: 'option',
      valueType: 'option',
      width: 100,
      render: (_: any, record: any) => (
        <ActionsWrap max={3} moreText="More">
          <Access accessible={hasPermission('Edit')}>
            <LinkButton
              onClick={() => {
                history.push(`/bot/built-in/edit/${record.id}`);
              }}
            >
              Edit
            </LinkButton>
          </Access>
          {record.botStatus === 'online' ? (
            <Access accessible={hasPermission('Offline')}>
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
                        message.success('succeed');
                        hide();
                        actionRef.current?.reload();
                      } else {
                        message.error(res.message);
                      }
                    })
                    .catch((err) => {
                      message.error(err);
                    });
                }}
              >
                Offline
              </LinkButton>
            </Access>
          ) : (
            <Access accessible={hasPermission('Online')}>
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
                        message.success('succeed');
                        hide();
                        actionRef.current?.reload();
                      } else {
                        message.error(res.message);
                      }
                    })
                    .catch((err) => {
                      message.error(err);
                    });
                }}
              >
                Online
              </LinkButton>
            </Access>
          )}
          {record.recommend && (
            <Access accessible={hasPermission('Unrecommend')}>
              <LinkButton
                // style={{ color: record.recommend ? 'orangered' : '' }}
                onClick={async () => {
                  const { id, recommend } = record;
                  if (recommend) {
                    const hide = message.info('processing...');
                    const res = await putBotManageBotIdUnrecommend({ id });
                    if (res?.code === 0) {
                      message.success('succees');
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
                Unrecommend
              </LinkButton>
            </Access>
          )}
          {!record.recommend && (
            <Access accessible={hasPermission('Recommend')}>
              <LinkButton
                // style={{ color: record.recommend ? 'orangered' : '' }}
                onClick={async () => {
                  const { id, recommend } = record;
                  if (recommend) {
                    const hide = message.info('processing...');
                    const res = await putBotManageBotIdUnrecommend({ id });
                    if (res?.code === 0) {
                      message.success('succees');
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
                Recommend
              </LinkButton>
            </Access>
          )}
        </ActionsWrap>
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
        // params={{ botSource: 'userCreated' }}
        // params={{ botSource: 'builtIn' }}
        toolBarRender={() => [
          <Access key="acc1" accessible={hasPermission('Add')}>
            <Button
              key="1"
              type="primary"
              onClick={() => {
                history.push(`/bot/built-in/edit/new`);
              }}
            >
              Add New
            </Button>
          </Access>,
        ]}
        request={async (params, sorter, filter) => {
          const { data } = await getBotManageBots({
            ...params,
            botSource: 'builtIn',
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
