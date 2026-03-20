import ActionsWrap from '@/components/ActionsWrap';
import LinkButton from '@/components/LinkButton';
import { getUserManagePushLists } from '@/services/api/tuisongjilu';
import {
  deleteUserManagePushJobId,
  getUserManagePushJobList,
} from '@/services/api/tuisongrenwuguanli';
import { ExclamationCircleFilled } from '@ant-design/icons';
import {
  ActionType,
  PageContainer,
  ProCard,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Button, message, Modal, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone'; // ES 2015
import utc from 'dayjs/plugin/utc'; // ES 2015
import { useRef, useState } from 'react';
dayjs.extend(utc);
dayjs.extend(timezone);

const { Text, Title } = Typography;

interface AdminPush {
  id?: number;
  title?: string;
  content?: string;
  pushTo?: string;
  soundAlert?: number;
  operator?: string;
  received?: number;
  pushTotal?: number;
  pushTime?: string;
  createdAt?: string;
}

export default () => {
  const actionRef = useRef<ActionType>();

  const [activeKey, setActiveKey] = useState('1');

  const columnsTask: ProColumns<AdminPush>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      editable: false,
      align: 'center',
      width: 100,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      editable: false,
      align: 'center',
      width: '20%',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      editable: false,
      align: 'center',
      width: 100,
    },
    {
      title: 'Creat Time',
      dataIndex: 'createdAt',
      editable: false,
      align: 'center',
      width: 100,
      renderText: (createdAt) =>
        dayjs(createdAt).utcOffset('+05:00').format('YYYY-MM-DD HH:mm:ss'),
      search: {
        transform: (value) => {
          return {
            minPushTime: `${value[0]} 00:00:00`,
            maxPushTime: `${value[1]} 23:59:59`,
          };
        },
      },
    },
    {
      title: 'Action',
      align: 'center',
      dataIndex: 'option',
      fixed: 'right',
      hideInSearch: true,
      render: (_v, record) => (
        <ActionsWrap max={3}>
          <LinkButton
            onClick={() => {
              history.push(
                '/notifications/pushNotifications/task-detail/' + record.id,
              );
            }}
          >
            View
          </LinkButton>
          <LinkButton
            onClick={() => {
              Modal.confirm({
                title: `Are you sure delete this item?`,
                icon: <ExclamationCircleFilled />,
                okType: 'danger',
                onOk: () => {
                  if (record.id) {
                    const hide = message.loading('loading...', 0);
                    deleteUserManagePushJobId({
                      id: record.id,
                    }).then((res) => {
                      hide();
                      if (res.code === 0) {
                        message.success(
                          'Operation successful，About to refresh',
                          1.5,
                          () => {
                            actionRef.current?.reload();
                          },
                        );
                      } else {
                        message.error(res.msg);
                      }
                    });
                  }
                },
              });
            }}
          >
            Delete
          </LinkButton>
        </ActionsWrap>
      ),
    },
  ];

  const columnsRecord: ProColumns<AdminPush>[] = [
    {
      title: 'Title',
      dataIndex: 'title',
      editable: false,
      align: 'center',
      width: 80,
    },
    {
      title: 'Content',
      dataIndex: 'content',
      editable: false,
      align: 'center',
      width: 100,
    },
    {
      title: 'Operator',
      dataIndex: 'operator',
      editable: false,
      align: 'center',
      width: 80,
    },

    {
      title: 'Received/Total',
      dataIndex: 'received',
      editable: false,
      align: 'center',
      hideInSearch: true,
      width: 60,
      renderText: (v, record) => `${v || 0}/${record?.pushTotal || 0}`,
    },
    {
      title: 'Push Time',
      dataIndex: 'pushTime',
      align: 'center',
      editable: false,
      width: 130,
      renderText: (pushTime) => {
        console.log({ pushTime });
        return pushTime
          ? dayjs(pushTime).utcOffset('+05:00').format('YYYY-MM-DD HH:mm:ss')
          : '-';
      },
      hideInSearch: true,
    },
    {
      title: 'Push Time',
      dataIndex: 'pushTime',
      align: 'center',
      editable: false,
      width: 130,
      // renderText: (pushTime) => {
      //   console.log({pushTime})
      //   return pushTime ? dayjs(pushTime).utcOffset('+05:00').format('YYYY-MM-DD HH:mm:ss') : '-'
      // },

      // render: (_v, record: any) =>
      //   record?.pushTime
      //     ? dayjs(record?.pushTime).format('YYYY-MM-DD HH:mm:ss')
      //     : '-',

      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            minPushTime: `${value[0]} 00:00:00`,
            maxPushTime: `${value[1]} 23:59:59`,
          };
        },
      },
    },
    {
      title: 'Action',
      align: 'center',
      dataIndex: 'option',
      fixed: 'right',
      hideInSearch: true,
      render: (_v, record) => (
        <ActionsWrap max={3}>
          <LinkButton
            onClick={() => {
              history.push(
                '/notifications/pushNotifications/record-detail/' + record.id,
              );
            }}
          >
            View
          </LinkButton>
        </ActionsWrap>
      ),
    },
  ];

  return (
    <PageContainer
      title={
        <Space size={0} direction="vertical">
          <Title level={4}>Push-notifications Management</Title>
          <Text type="danger">
            Please note that the time objects displayed, used, and set in the
            current section are all based on Kazakhstan (UTC+5) time.
          </Text>
        </Space>
      }
    >
      <ProCard title={''} style={{ marginBlockEnd: 24 }}>
        <ProTable<AdminPush>
          actionRef={actionRef}
          rowKey="id"
          // headerTitle="Push List"
          search={{
            labelWidth: 100,
          }}
          // options={false}
          toolbar={{
            menu: {
              type: 'tab',
              activeKey: activeKey,
              items: [
                {
                  key: '1',
                  label: 'Task',
                  // children: 'Content of Tab Pane 1'
                },
                {
                  key: '2',
                  label: 'Send record',
                  // children: 'Content of Tab Pane 2'
                },
              ],
              onChange: (key) => {
                setActiveKey(key as string);
              },
            },
          }}
          toolBarRender={
            activeKey === '1'
              ? () => [
                  <Button
                    key={'1'}
                    type="primary"
                    onClick={() => {
                      history.push('/notifications/pushNotifications/new');
                    }}
                  >
                    New Push
                  </Button>,
                ]
              : false
          }
          params={{ activeKey }}
          request={async (params) => {
            const newParams: any = {
              ...params,
              pageNo: params.current || 1,
              pageSize: params.pageSize || 10,
            };
            delete newParams.size;
            delete newParams.current;

            const { activeKey } = newParams;
            delete newParams.current;

            const {
              data: { list, total },
            } =
              activeKey === '1'
                ? await getUserManagePushJobList({
                    ...newParams,
                  })
                : await getUserManagePushLists({
                    ...newParams,
                    activeKey: undefined,
                  });

            return {
              data: list || [],
              success: true,
              total,
            };
          }}
          columns={activeKey === '1' ? columnsTask : columnsRecord}
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
