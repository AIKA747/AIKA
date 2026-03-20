import LinkButton from '@/components/LinkButton';
import {
  getContentManageStory,
  getContentManageStoryId,
  putContentManageStory,
} from '@/services/api/contentService';
import {
  ActionType,
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Badge, Breadcrumb, Button, Divider, message } from 'antd';
import React, { useRef } from 'react';

const TableList: React.FC<unknown> = () => {
  const actionRef = useRef<ActionType>();

  const columns = [
    {
      title: 'Story name',
      dataIndex: 'storyName',
      width: 100,
    },
    {
      title: 'Reward',
      dataIndex: 'rewardsScore',
      valueType: 'text',
      hideInSearch: true,
      width: 60,
    },
    {
      title: 'Cutoff',
      dataIndex: 'cutoffScore',
      hideInSearch: true,
      width: 80,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 80,
      valueType: 'select',
      valueEnum: {
        invalid: 'Invalid',
        valid: 'Valid',
      },
      render: (_v: any, record: any) => {
        return (
          <Badge
            status={record?.status === 'valid' ? 'success' : 'default'}
            text={record?.status}
          />
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
            minCreatedAt: `${value[0]} 00:00:00`,
            maxCreatedAt: `${value[1]} 23:59:59`,
          };
        },
      },
    },
    {
      title: 'Created time',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      hideInSearch: true,
      width: 100,
    },
    {
      title: 'action',
      dataIndex: 'option',
      valueType: 'option',
      width: 100,
      render: (_v: any, record: any) => (
        <>
          <LinkButton
            onClick={() => {
              history.push(`/story/list/edit/${record.id}`, '_blank');
            }}
          >
            Edit
          </LinkButton>
          <Divider type="vertical" />

          <LinkButton
            style={{ color: record.status === 'valid' ? 'red' : '' }}
            onClick={async () => {
              const { id, status } = record;
              const hide = message.info('saving....');
              const details = await getContentManageStoryId({
                id,
              });

              if (details.code === 0) {
                const { data } = details;
                putContentManageStory({
                  ...data,
                  status: status === 'valid' ? 'invalid' : 'valid',
                  id,
                } as any)
                  .then((res) => {
                    if (res.code === 0) {
                      hide();
                      message.success('Success');
                      actionRef.current?.reload();
                    } else {
                      message.error(res.msg || res.msg);
                    }
                  })
                  .catch((err) => message.error(err));
              }
              //   putContentManageStoryStatus({
              //     id,
              //     status: status === 'valid' ? 'invalid' : 'valid',
              //   })
              //     .then((res) => {
              //       if (res.code === 0) {
              //         hide();
              //         message.success("Success");
              //         actionRef.current?.reload();
              //       } else {
              //         message.error(res.msg || res.msg);
              //       }
              //     })
              //     .catch((err) => message.error(err || res.msg));
            }}
          >
            {record.status === 'valid' ? 'Invalid' : 'Valid'}
          </LinkButton>
        </>
      ),
    },
  ];

  return (
    <PageContainer
      breadcrumb={
        (
          <Breadcrumb>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>Story Management</Breadcrumb.Item>
            <Breadcrumb.Item>
              <a href="">Story Management</a>
            </Breadcrumb.Item>
          </Breadcrumb>
        ) as any
      }
    >
      <ProTable<API.UserInfo>
        headerTitle="Story List"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            key="1"
            type="primary"
            onClick={() => {
              history.push(`/story/list/edit/new`);
            }}
          >
            Add New
          </Button>,
        ]}
        request={async (params, sorter, filter) => {
          const { data } = await getContentManageStory({
            ...params,
            // FIXME: remove @ts-ignore
            // @ts-ignore
            sorter,
            filter,
            pageNo: params.current || 1,
            pageSize: params.pageSize || 10,
          });
          console.log(data);

          return {
            data: data.list || [],
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
